import APIClient from "./APIClient";

const LocationService = {
  async getLocation() {
    const { data } = await APIClient.get("/location");
    return data;
  },
};

export default LocationService;
