import { API, APIPayload, Response } from './';
import { LoadStatus } from '../enums/LoadStatus';

let api_impl: { handler: (payload: APIPayload, onResponse: Response) => void };

export const api: API = {
  handler: async (
    payload: APIPayload,
    onResponse: Response
  ): Promise<string> => {
    api_impl.handler(payload, onResponse);
    return 'called the JS API';
  },
  init: async (apiConfig, onResponse) => {
    api_impl = apiConfig.options.jsModule;
    onResponse({ data: LoadStatus.READY });
    return LoadStatus.READY;
  },
};
