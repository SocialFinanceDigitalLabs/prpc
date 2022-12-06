import { APIImplementation, LoadStatus } from '../types';

let api_impl: { handler: (method: string, value: any) => Promise<any> };

const api: APIImplementation = {
  handler: (method: string, value: any): Promise<any> => {
    return api_impl.handler(method, value);
  },
  init: async (apiConfig, onResponse) => {
    api_impl = apiConfig.options.jsModule;
    onResponse(LoadStatus.READY);
  },
};

export default api;
