import omitBy from "lodash/omitBy";

export const omitMeta = obj => omitBy(obj, (_, key) => key.startsWith("__"));
