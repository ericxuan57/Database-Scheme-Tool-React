import * as yup from 'yup';
import { ObjectShape } from 'yup';

export const phoneRegExp =
  /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

export const yupObject = (object?: ObjectShape) =>
  yup.object(object).transform(value => (JSON.stringify(value) === '{}' ? undefined : value));
export const yupString = yup.string().transform(value => (!value ? undefined : value));
export const yupBoolean = yup.boolean();
export const yupNumber = yup.number();
export const yupMixed = yup.mixed();
export const yupDate = yup.date();
export const yupArray = (type: any) =>
  yup
    .array()
    .of(type)
    .transform(value => (!value ? [] : value));

export const requiredString = yupString.required();
export const requiredBoolean = yupBoolean.required();
export const requiredNumber = yupNumber.required().transform(value => (isNaN(value) ? undefined : value));
export const requiredMixed = yupMixed.required();
export const requiredDate = yupDate.required();
export const requiredObject = (object?: ObjectShape) => yupObject(object).required();
export const requiredArray = (type: any) => yupArray(type).min(1).required();
