import APIClient from "./APIClient";

const AvailabilityService = {
  async getAvailability() {
    const { data } = await APIClient.get("/availability");
    return data;
  },
};

export default AvailabilityService;
