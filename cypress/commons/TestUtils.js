// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// eslint-disable-next-line sonarjs/pseudo-random -- weak random function is safe for our cypress tests
const getRandom = () => Math.random();

const randomStr = (stringLength) => {
  return Array.from({ length: stringLength }, () => getRandom().toString(36).substring(2, 3)).join('');
};

const randomNmbr = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(getRandom() * (max - min) + min);
};

const randomEnum = (enumParam) => {
  const rand = Math.floor(getRandom() * Object.keys(enumParam).length);

  return enumParam[Object.keys(enumParam)[rand]];
};

const randomDate = (dateMin, dateMax) => {
  return stringToDateInputExpectedFormat(dateMin.getTime() + getRandom() * (dateMax.getTime() - dateMin.getTime()));
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
