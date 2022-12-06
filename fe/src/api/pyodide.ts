import { v4 as uuidv4 } from 'uuid';
import {
  APIImplementation,
  APICallback,
  APIConfig,
  APIPayload,
  LoadStatus,
  ResolverPromise,
} from '../types';
import {
  PyodideWorkerAction,
  PyodideWorkerDTO,
  PyodideWorkerResponseDTO,
} from '../workers/pyodide.types';

let worker: Worker;
const responseMap: Record<string, ResponseHandler> = {};

const createMessage = (
  action: PyodideWorkerAction,
  body?: any,
  closes = true
): PyodideWorkerDTO => {
  return {
    id: uuidv4(),
    action,
    body,
    closes,
  } as PyodideWorkerDTO;
};

class ResponseHandler {
  resolve: APICallback;
  reject: APICallback;

  constructor(resolve?: APICallback, reject?: APICallback) {
    this.resolve = (data) =>
      resolve || console.error('Unhandled resolve', data);
    this.reject = (data) => reject || console.error('Unhandled reject', data);
  }

  handler: ResolverPromise = (resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  };
}

const api: APIImplementation = {
  handler: (payload: APIPayload): Promise<ResolverPromise> => {
    const message = createMessage(PyodideWorkerAction.RUN, payload);
    const responseHandler = new ResponseHandler();
    const promise = new Promise(responseHandler.handler);
    responseMap[message.id] = responseHandler;
    worker.postMessage(message);
    return promise;
  },

  init: async (apiConfig: APIConfig, onResponse: APICallback) => {
    worker = new Worker(
      new URL('../workers/pyodide.worker.ts', import.meta.url)
    );

    // Message response handler - look up request by ID and invoke resolver function
    worker.onmessage = (rec: MessageEvent<PyodideWorkerResponseDTO>) => {
      const resolver = responseMap[rec.data.id];
      if (rec.data.error) {
        resolver.reject(rec.data.error);
      } else {
        resolver.resolve(rec.data.body);
        if (rec.data.closes) {
          delete responseMap[rec.data.id];
        }
      }

      // Bridge between handlers and responses
      const message = createMessage(PyodideWorkerAction.INIT, apiConfig, false);
      const responseHandler = new ResponseHandler();
      const promise = new Promise(responseHandler.handler);
      const realResolve = responseHandler.resolve;
      responseHandler.resolve = (status: LoadStatus) => {
        onResponse(status);
        if (status == LoadStatus.READY) {
          // Resolve promise on load completion
          realResolve(status);
        }
      };
      responseMap[message.id] = responseHandler;

      worker.postMessage(message);

      return promise;
    };
  },
};

export default api;
