// eslint-disable-next-line no-unused-vars
import { create, AxiosInstance, AxiosResponse } from "axios";

export default class APIClient {
  /** @type AxiosInstance */
  client;

  /**
   * Constructs an APIClient.
   *
   * @param {string} baseURL
   */
  constructor(baseURL) {
    this.client = create({ baseURL: baseURL });
  }

  /** @returns {Promise<AxiosResponse<any>>} */
  getAbout() {
    return this.client.get("/about");
  }

  /** @returns {Promise<AxiosResponse<any>>} */
  getNowPlaying() {
    return this.client.get("/nowplaying");
  }

  /** @returns {Promise<AxiosResponse<any>>} */
  getProductivity() {
    return this.client.get("/productivity");
  }

  /**
   * @param {number} limit
   * @returns {Promise<AxiosResponse<any>>}
   */
  getCommits(limit) {
    return this.client.get("/commits", { params: { limit } });
  }
}
