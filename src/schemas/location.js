import * as yup from "yup";

export const coordinates = yup.array().of(yup.number().required());

const address = yup.object().shape({
  label: yup.string().required(),
  country: yup.string().required(),
  state: yup.string().required(),
  county: yup.string().required(),
  city: yup.string().required(),
  district: yup.string(),
  postalCode: yup.string().required(),
  street: yup.string(),
  number: yup.string(),
});

export const location = yup.object().shape({
  id: yup.string().required(),
  level: yup.string().required(),
  type: yup.string().required(),
  position: coordinates,
  shape: yup.array().of(coordinates.required()),
  address,
});
