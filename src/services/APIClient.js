// eslint-disable-next-line no-unused-vars
import { create, AxiosInstance } from "axios";
const { VUE_APP_API_BASE_URL } = process.env;

/** @type {AxiosInstance} */
const APIClient = create({
  baseURL: VUE_APP_API_BASE_URL || "https://api.stevenxie.me",
});

export default APIClient;
