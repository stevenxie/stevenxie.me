// eslint-disable-next-line no-unused-vars
import { create, AxiosInstance } from "axios";
export const baseURL = process.env.VUE_APP_API_BASE_URL;

/** @type {AxiosInstance} */
const APIClient = create({
  baseURL: baseURL || "https://api.stevenxie.me",
});

export default APIClient;
