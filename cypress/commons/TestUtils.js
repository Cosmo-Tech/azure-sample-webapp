// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const randomStr = (figureNbr) => {
  return Math.random().toString(36).substring(figureNbr);
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

const utils = {
  randomStr,
  randomNmbr,
  randomEnum
};

export default utils;
