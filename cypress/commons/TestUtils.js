// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const randomStr = (stringLength) => {
  return Array.from({ length: stringLength }, () => Math.random().toString(36).substring(2, 3)).join('');
};

const randomNmbr = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
};

const randomEnum = (enumParam) => {
  const rand = Math.floor(Math.random() * Object.keys(enumParam).length);

  return enumParam[Object.keys(enumParam)[rand]];
};

const randomDate = (dateMin, dateMax) => {
  return stringToDateInputExpectedFormat(dateMin.getTime() + Math.random() * (dateMax.getTime() - dateMin.getTime()));
};

const stringToDateInputExpectedFormat = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const utils = {
  randomStr,
  randomNmbr,
  randomEnum,
  randomDate,
  stringToDateInputExpectedFormat,
};

export default utils;
