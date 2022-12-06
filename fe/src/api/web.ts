import { AttachedFileSerializer } from '../util/dataTransfer';
import {
  APIImplementation,
  APICallback,
  APIConfig,
  LoadStatus,
  ResolverPromise,
} from '../types';

class WebApi implements APIImplementation {
  config: APIConfig | null = null;

  async init(apiConfig: APIConfig, onResponse: APICallback): Promise<void> {
    this.config = apiConfig;
    onResponse(LoadStatus.READY);
  }

  async handler(payload: any): Promise<ResolverPromise> {
    if (!this.config) {
      throw 'API not configured yet. Must call `init` before using API';
    }
    const { method, value } = payload;

    const serializer = new AttachedFileSerializer();
    const jsonValue = JSON.stringify(value, serializer.serializer);

    const formData = new FormData();
    if (this.config.options.appName) {
      formData.append('RPC-App', this.config.options.appName);
    }
    formData.append('method', method);
    formData.append('value', jsonValue);
    serializer.formDataAppend(formData);

    const response = await fetch(this.config.options.url, {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw `Server responded with error: ${response.status}`;
    }
  }
}

const api = new WebApi();

export default api;
