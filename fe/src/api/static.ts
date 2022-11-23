import { API, APIPayload, Response } from './';
import { LoadStatus } from '../enums/LoadStatus';

let api_impl: { handler: (payload: APIPayload) => Promise<any> };

export const api: API = {
  handler: (payload: APIPayload): Promise<any> => {
    return api_impl.handler(payload);
  },
  init: async (apiConfig, onResponse) => {
    api_impl = apiConfig.options.jsModule;
    onResponse(LoadStatus.READY);
  },
};
