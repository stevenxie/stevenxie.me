import * as yup from "yup";

export const segment = yup.object().shape({
  name: yup.string().required(),
  id: yup
    .number()
    .integer()
    .required(),
  duration: yup
    .number()
    .integer()
    .min(0)
    .required(),
});
