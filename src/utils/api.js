import axios from "axios";

const { API_URL } = process.env;
const baseConfig = { baseURL: API_URL };

/** A stateless client for the Steven Xie API. */
export const APIClient = {
  /**
   * @param {string} url
   * @param {AxiosRequestConfig} config
   * @returns {Promise}
   */
  get: (url, config) => axios.get(url, Object.assign(config, baseConfig)),
};
