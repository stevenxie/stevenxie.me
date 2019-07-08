import { client } from "@/api";

const service = {
  async getProductivity() {
    const { data } = await client.get("/productivity");
    return data;
  },
};

export default service;
