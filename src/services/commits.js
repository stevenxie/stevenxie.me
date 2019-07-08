import { client } from "@/api";

const commits = {
  async getCommits(limit = 3) {
    const { data } = await client.get("/commits", { limit });
    return data;
  },
};

export default commits;
