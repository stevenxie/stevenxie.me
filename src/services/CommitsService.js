import APIClient from "./APIClient";

const CommitsService = {
  async getCommits(limit = 3) {
    const { data } = await APIClient.get("/commits", { limit });
    return data;
  },
};

export default CommitsService;
