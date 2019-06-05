import * as yup from "yup";

export const period = yup.object().shape({
  start: yup.string().required(),
  end: yup.string().required(),
});
