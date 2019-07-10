import { client } from "@/api";

const service = {
  async getLocation() {
    const { data } = await client.get("/location");
    return data;
  },

  /** @param {string} code */
  async getRecentLocationHistory(code) {
    const { data } = await client.get("location/history", {
      headers: { Authorization: `Bearer ${code}` },
    });
    return data;
  },
};

export default service;