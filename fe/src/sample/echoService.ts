const api = {
  handler: async (method: string, value: any): Promise<any> => {
    return { method, value };
  },
};

export default api;
