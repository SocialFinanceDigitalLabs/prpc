import { API, APIPayload, Response } from './';
import { LoadStatus } from '../enums/LoadStatus';
import { PyodideWorkerAction } from '../enums/WorkerActions';

export type PyodideWorkerDTO = {
  action: PyodideWorkerAction;
  body?: any;
};

let worker: Worker;
let responseHandler: Response;

export const api: API = {
  handler: async (
    payload: APIPayload,
    onResponse: Response,
    config?: any
  ): Promise<string> => {
    const message: PyodideWorkerDTO = {
      action: PyodideWorkerAction.RUN,
      body: {
        payload,
        config: config || {},
      },
    };

    responseHandler = onResponse;

    worker.postMessage(message);

    return 'running code...';
  },

  init: async (onResponse: Response) => {
    worker = new Worker(
      new URL('../workers/pyodide.worker.ts', import.meta.url)
    );

    responseHandler = onResponse;

    worker.onmessage = (rec: any) => {
      responseHandler(rec);
    };

    const message: PyodideWorkerDTO = {
      action: PyodideWorkerAction.INIT,
    };

    worker.postMessage(message);

    return LoadStatus.READY;
  },
};
