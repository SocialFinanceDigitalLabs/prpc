import { LoadStatus } from '../enums/LoadStatus';

export enum APITransport {
  PYODIDE = 'pyodide',
  WEB = 'web',
  STATIC = 'static',
}

export type API = {
  handler: (payload: any, onResponse: Response) => Promise<string>;
  init: (apiConfig: APIConfig, onResponse: Response) => Promise<LoadStatus>;
};

export type APIPayload = {
  method: string;
  value: string | any;
};

export type Response = (response: any) => void;

export type APIConfig = {
  transport: APITransport;
  options: any;
};

interface IAPIControl {
  api: any;
  loadStatus: LoadStatus;
  loadTransport: (
    apiConfig: APIConfig,
    onResponse: Response
  ) => Promise<LoadStatus>;
  callAPI: (payload: any, onResponse: Response) => Promise<string>;
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
    const apiReady = await this.api.api.init(apiConfig, onResponse);
    return apiReady;
  };

  getMethod = () => {
    return this.api;
  };

  callAPI = async (
    payload: APIPayload,
    onResponse: Response,
  ): Promise<any> => {
    const startup = await this.api.api.handler(payload, onResponse);
    return startup;
  };
}
