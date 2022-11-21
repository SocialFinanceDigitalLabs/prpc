import { APIPayload } from '..';

const api = {
    handler: async (
        payload: APIPayload,
        onResponse: (response: any) => void
    ): Promise<string> => {
        onResponse({"data": payload})
        return 'called the JS API';
    },
};

export default api;
