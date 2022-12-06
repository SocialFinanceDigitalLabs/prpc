export interface IAPI {
  call: (method: string, value: any) => Promise<any>;
}

export type APIImplementation = {
  handler: (method: string, value: any) => Promise<ResolverPromise>;
  init: (apiConfig: APIConfig, onResponse: APICallback) => Promise<void>;
};

export type APIConfig = {
  transport: APITransport;
  options: any;
};

export type APICallback = (value: any) => void;

export type ResolverPromise = (
  resolve: APICallback,
  reject: APICallback
) => void;

export enum APITransport {
  PYODIDE = 'pyodide',
  WEB = 'web',
  STATIC = 'static',
}

export enum LoadStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  READY = 'READY',
  ERROR = 'ERROR',
}

declare global {
  interface Window {
    loadPyodide: any;
    importScripts: any;
  }
}
