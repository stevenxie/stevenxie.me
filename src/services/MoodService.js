import { last } from "lodash";
import { APIClient } from "../utils/api";

export default class MoodService {
  /** @type {string} */
  lastMoodId;

  /**
   * @param {number} limit
   * @param {config} AxiosRequestConfig
   */
  getMoods = async (limit = 10, config) => {
    const { data } = await APIClient.get("/moods/", {
      params: { ...config, limit },
    });
    this.lastMoodId = last(data).id;
    return data;
  };

  /**
   * @param {number} limit
   * @param {config} AxiosRequestConfig
   * @returns {Promise}
   */
  getNextMoods = (limit = 10, config) =>
    this.getMoods(limit, { ...config, startId: this.lastMoodId });
}
