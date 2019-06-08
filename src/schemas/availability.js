import * as yup from "yup";

export const period = yup.object().shape({
  start: yup.date().required(),
  end: yup.date().required(),
});
