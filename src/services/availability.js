import mapValues from "lodash/mapValues";
import parse from "date-fns/parse";

import { client } from "@/api";

const service = {
  async getAvailability() {
    const { timeZone: tz } = Intl.DateTimeFormat().resolvedOptions();
    const { data } = await client.get("/availability", {
      params: { timezone: tz },
    });
    const { busy, timezone } = data;
    return { busy: busy.map(pair => mapValues(pair, parse)), timezone };
  },
};

export default service;
