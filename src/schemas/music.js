import * as yup from "yup";

export const artist = yup.object().shape({
  name: yup.string().required(),
  url: yup
    .string()
    .url()
    .required(),
});

const imageDimension = yup
  .number()
  .integer()
  .positive()
  .required();
export const album = yup.object().shape({
  name: yup.string().required(),
  url: yup
    .string()
    .url()
    .required(),
  images: yup
    .array()
    .of(
      yup.object().shape({
        height: imageDimension,
        width: imageDimension,
        url: yup
          .string()
          .url()
          .required(),
      })
    )
    .required(),
});

export const track = yup.object().shape({
  name: yup.string().required(),
  url: yup
    .string()
    .url()
    .required(),
  artists: yup
    .array()
    .of(artist)
    .required(),
  album: album.required(),
  duration: yup
    .number()
    .integer()
    .positive()
    .required(),
});

export const progress = yup
  .number()
  .integer()
  .min(0);
