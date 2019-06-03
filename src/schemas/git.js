import * as yup from "yup";

export const author = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
});

export const repo = yup.object().shape({
  name: yup.string().required(),
  url: yup
    .string()
    .url()
    .required(),
});

export const commit = yup.object().shape({
  sha: yup.string().required(),
  author,
  message: yup.string().required(),
  url: yup
    .string()
    .url()
    .required(),
  repo,
  timestamp: yup.string().required(),
});
