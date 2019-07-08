import { client } from "@/api";

const cache = {
  data: null,
  promise: null,
  timestamp: null,
};

const AboutService = {
  /**
   * Get about data from the server.
   *
   * @param {boolean} force Fetch new data, ignoring cached results.
   * @returns {Promise}
   */
  async getAbout(force = false) {
    if (cache.promise) await cache.promise;
    if (!cache.data || force) {
      cache.promise = client.get("/about");
      const { data } = await cache.promise;
      cache.data = data;
      cache.timestamp = new Date();
      cache.promise = null;
    }
    return cache.data;
  },

  async getEmail() {
    if (cache.promise) await cache.promise;
    const { email } = await this.getAbout();
    return email;
  },
};

export default AboutService;
