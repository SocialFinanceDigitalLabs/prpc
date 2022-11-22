import { APIPayload } from '..';

const api = {
  handler: async (payload: APIPayload): Promise<any> => {
    return payload;
  },
};

export default api;
