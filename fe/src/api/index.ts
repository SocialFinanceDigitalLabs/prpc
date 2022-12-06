import {
  APICallback,
  APIConfig,
  APIImplementation,
  APIPayload,
  IAPI,
} from '../types';

export class API implements IAPI {
  api: APIImplementation;

  constructor(api: APIImplementation) {
    this.api = api;
  }

  call = async (payload: APIPayload): Promise<unknown> =>
    await this.api.handler(payload);
}

export const createApi = async (
  apiConfig: APIConfig,
  callback: APICallback
): Promise<API> => {
  const implementation: APIImplementation = await import(`./${apiConfig.transport}`);
  await implementation.init(apiConfig, callback);
  return new API(implementation);
};
