import * as yup from "yup";

export const coordinates = yup
  .object()
  .shape({ x: yup.number(), y: yup.number(), z: yup.number(0) });

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
  shape: yup.array().of(
    yup
      .array()
      .of(yup.number().required())
      .required()
  ),
  address,
});
