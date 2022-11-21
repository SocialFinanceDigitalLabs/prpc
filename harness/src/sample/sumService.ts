import { APIPayload } from '@sfdl/prpc';



const api = {
    handler: async (
        payload: APIPayload,
        onResponse: (response: any) => void
    ): Promise<string> => {
        if (payload.method === "sum") {
            onResponse({"data": payload.value.a + payload.value.b})
        } else if (payload.method === "sumlist") {
            onResponse({"data": payload.value.reduce(
                    (a: bigint, c: bigint) => a+c, 0
                )
            })
        }

        return 'called the JS API';
    },
};

export default api;