import APIClient from "./APIClient";

const LocationService = {
  async getLocation() {
    const { data } = await APIClient.get("/location");
    return data;
  },
  /** @param {string} code */
  async getRecentLocationHistory(code) {
    const { data } = await APIClient.get("location/history", {
      headers: { Authorization: `Bearer ${code}` },
    });
    return data;
  },
};

export default LocationService;
