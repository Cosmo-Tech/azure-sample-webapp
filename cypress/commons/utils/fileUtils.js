// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const parseMultipartFormData = (dataString) => {
  const boundary = dataString.split('\r\n')[0];
  let formParts = dataString.split(boundary);
  formParts.pop();
  formParts.shift();
  formParts = formParts.map((el) => el.replace(/\r\n$/, ''));
  formParts = formParts.map((el) => el.replace(/^\r\n/, ''));

  const form = {};
  formParts.forEach((formPart) => {
    const regexMatch = formPart.match(/Content-Disposition: form-data; name="(\w*)"(?:[\S\s]*)?\r\n\r\n([\S\s]*)/);
    const parameterName = regexMatch[1];
    form[parameterName] = regexMatch[2];
  });
  return form;
};

export const fileUtils = {
  parseMultipartFormData,
};
