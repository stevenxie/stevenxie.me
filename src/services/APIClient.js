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
}
