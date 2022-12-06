import { APIImplementation, APIPayload, LoadStatus } from '../types';

let api_impl: { handler: (payload: APIPayload) => Promise<any> };

const api: APIImplementation = {
  handler: (payload: APIPayload): Promise<any> => {
    return api_impl.handler(payload);
  },
  init: async (apiConfig, onResponse) => {
    api_impl = apiConfig.options.jsModule;
    onResponse(LoadStatus.READY);
  },
};

export default api;
