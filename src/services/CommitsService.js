import { client } from "@/api";

const CommitsService = {
  async getCommits(limit = 3) {
    const { data } = await client.get("/commits", { limit });
    return data;
  },
};

export default CommitsService;
