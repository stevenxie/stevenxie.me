import * as yup from "yup";

// eslint-disable-next-line no-unused-vars
import { create, AxiosInstance, AxiosResponse } from "axios";
import { format } from "date-fns";

export default class APIService {
  /** @type AxiosInstance */
  client;

  /**
   * Constructs an APIService.
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

  /**
   * @param {string | Date} date
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAvailability(date) {
    let params = {};
    if (date) {
      if (yup.date().isValidSync(date))
        params = { date: format(date, "YYYY-MM-DD") };
      else if (yup.string().isValidSync(date)) params = { date };
      else throw new Error("APIService: invalid Date argument type");
    }
    return this.client.get("/availability", { params });
  }
}
