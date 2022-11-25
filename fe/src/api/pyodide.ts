import { API, APIConfig, APIPayload, Response } from './';
import { PyodideWorkerAction } from '../enums/WorkerActions';
import { v4 as uuidv4 } from 'uuid';

export type PyodideWorkerDTO = {
  id: string;
  action: PyodideWorkerAction;
  body?: any;
  closes: boolean;
};

export type PyodideWorkerResponseDTO = {
  id: string;
  body?: any;
  error?: any;
  closes: boolean;
};

let worker: Worker;
const responseMap: Record<string, ResponseHandler> = {};

const createMessage = (
  action: PyodideWorkerAction,
  body?: any,
  closes = true
): PyodideWorkerDTO => {
  const message: PyodideWorkerDTO = {
    id: uuidv4(),
    action,
    body,
    closes,
  };
  return message;
};

class ResponseHandler {
  resolve: any = null;
  reject: any = null;
  handler = (resolve: any, reject: any) => {
    this.resolve = resolve;
    this.reject = reject;
  };
}

export const api: API = {
  handler: (payload: APIPayload): Promise<any> => {
    const message = createMessage(PyodideWorkerAction.RUN, payload);
    const responseHandler = new ResponseHandler();
    const promise = new Promise(responseHandler.handler);
    responseMap[message.id] = responseHandler;
    worker.postMessage(message);
    return promise;
  },

  init: async (apiConfig: APIConfig, onResponse: Response) => {
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
      }
      if (rec.data.closes) {
        delete responseMap[rec.data.id];
      }
    };

    const message = createMessage(PyodideWorkerAction.INIT, apiConfig, false);
    const responseHandler = new ResponseHandler();
    responseHandler.handler(onResponse, (data: any) =>
      onResponse({ error: data })
    );
    responseMap[message.id] = responseHandler;

    worker.postMessage(message);
  },
};
