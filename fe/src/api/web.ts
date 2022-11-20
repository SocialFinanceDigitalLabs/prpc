import { API, APIConfig, APIPayload, Response } from './';
import { LoadStatus } from '../enums/LoadStatus';

let config: APIConfig;

export const api: API = {
  init: async (apiConfig, onResponse) => {
    config = apiConfig;

    // TODO: We should check the API here - do we always support a 'ping' service?

    onResponse({ data: LoadStatus.READY });
    return LoadStatus.READY;
  },
  handler: async (
    payload: APIPayload,
    onResponse: Response
  ): Promise<string> => {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (config.options.appName) {
      headers['RPC-App'] = config.options.appName;
    }
    const response = await fetch(`${config.options.url}/${payload.method}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload.value),
    });
    const data = await response.json();
    onResponse({ data });
    return 'called the Web API';
  },
};
