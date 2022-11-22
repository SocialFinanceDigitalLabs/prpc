import { API, APIConfig, APIPayload, Response } from './';
import { LoadStatus } from '../enums/LoadStatus';
import { AttachedFileSerializer } from '../util/dataTransfer';

let config: APIConfig;

export const api: API = {
  init: async (apiConfig, onResponse) => {
    config = apiConfig;
    // TODO: We should check the API here - do we always support a 'ping' service?
    onResponse(LoadStatus.READY);
  },
  handler: async (payload: APIPayload): Promise<any> => {
    const { method, value } = payload;

    const serializer = new AttachedFileSerializer();
    const jsonValue = JSON.stringify(value, serializer.serializer);

    const formData = new FormData();
    if (config.options.appName) {
      formData.append('RPC-App', config.options.appName);
    }
    formData.append('method', method);
    formData.append('value', jsonValue);
    serializer.formDataAppend(formData);

    const response = await fetch(config.options.url, {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw `Server responded with error: ${response.status}`;
    }
  },
};
