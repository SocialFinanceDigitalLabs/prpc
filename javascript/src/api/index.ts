import {
  APICallback,
  APIConfig,
  APIImplementation,
  IAPI,
} from '../types';

export class API implements IAPI {
  api: APIImplementation;

  constructor(api: APIImplementation) {
    this.api = api;
  }

  call = async (method: string, value: unknown): Promise<unknown> =>
    await this.api.handler(method, value);
}

export const createApi = async (
  apiConfig: APIConfig,
  callback: APICallback
): Promise<API> => {
  const implementation = await import(`./${apiConfig.transport}`);
  const api: APIImplementation = implementation.default;
  await api.init(apiConfig, callback);
  return new API(api);
};
