import { APIClient } from "../utils/api";

const MAX_MOODS_LIMIT = 50;

export default class MoodService {
  /**
   * @param {number} limit
   * @param {config} AxiosRequestConfig
   */
  getMoods = async (limit = 10, offset = 0, config = {}) => {
    const params = {
      limit: limit > MAX_MOODS_LIMIT ? MAX_MOODS_LIMIT : limit,
      offset,
    };
    const { data } = await APIClient.get("/moods", { ...config, params });

    // Check if more pages of moods are required.
    if (data.length < limit && data.length == MAX_MOODS_LIMIT) {
      const nextLimit = limit - MAX_MOODS_LIMIT;
      const nextOffset = offset + data.length;
      const nextData = await this.getMoods(nextLimit, nextOffset, config);
      return data.concat(nextData);
    }
    return data;
  };
}

export const sharedMoodService = new MoodService();
