import { APIPayload } from '@sfdl/prpc';



const api = {
    handler: async (
        payload: APIPayload,
    ): Promise<any> => {
        if (payload.method === "sum") {
            return payload.value.a + payload.value.b;
        } else if (payload.method === "sumlist") {
            return payload.value.reduce(
                (a: bigint, c: bigint) => a+c, 0
            )
        }
    },
};

export default api;