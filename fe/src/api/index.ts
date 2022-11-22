import { LoadStatus } from '../enums/LoadStatus';

export enum APITransport {
  PYODIDE = 'pyodide',
  WEB = 'web',
  STATIC = 'static',
}

export type API = {
  handler: (payload: any, onResponse: Response) => Promise<string>;
  init: (apiConfig: APIConfig, onResponse: Response) => Promise<any>;
};

export type APIPayload = {
  method: string;
  value: any;
};

export type Response = (response: any) => void;

export type APIConfig = {
  transport: APITransport;
  options: any;
};

interface IAPIControl {
  api: any;
  loadStatus: LoadStatus;
  loadTransport: (apiConfig: APIConfig, onResponse: Response) => void;
  callAPI: (payload: APIPayload) => Promise<any>;
}

export class APIControl implements IAPIControl {
  api: any = null;

  constructor() {
    this.api = null;
  }

  loadStatus = LoadStatus.IDLE;

  loadTransport = async (
    apiConfig: APIConfig,
    onResponse: Response
  ): Promise<any> => {
    this.api = await import(`./${apiConfig.transport}`);
    this.api.api.init(apiConfig, onResponse);
  };

  callAPI = (payload: APIPayload): Promise<any> => {
    return this.api.api.handler(payload);
  };
}
