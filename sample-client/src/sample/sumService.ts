const api = {
  handler: async (method: any, payload: any): Promise<any> => {
    if (method === "sum") {
      return payload.value.a + payload.value.b;
    } else if (payload.method === "sumlist") {
      return payload.value.reduce((a: bigint, c: bigint) => a + c, 0);
    }
  },
};

export default api;
