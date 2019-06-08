import mapValues from "lodash/mapValues";
import parse from "date-fns/parse";
import APIClient from "./APIClient";

const AvailabilityService = {
  async getAvailability() {
    const { data } = await APIClient.get("/availability");
    const { busy, timezone } = data;
    return { busy: busy.map(pair => mapValues(pair, parse)), timezone };
  },
};

export default AvailabilityService;
