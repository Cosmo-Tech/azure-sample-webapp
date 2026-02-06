// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const parseMultipartFormData = (data) => {
  // Handle case where data is not a string (e.g., ArrayBuffer, Blob, or other types)
  let dataString;
  if (typeof data === 'string') {
    dataString = data;
  } else if (data instanceof ArrayBuffer) {
    dataString = new TextDecoder().decode(data);
  } else if (data instanceof Uint8Array) {
    dataString = new TextDecoder().decode(data);
  } else {
    // If we can't parse the data, return an empty object
    console.warn('parseMultipartFormData: Unable to parse data of type', typeof data);
    return {};
  }

  const boundary = dataString.split('\r\n')[0];
  let formParts = dataString.split(boundary);
  formParts.pop();
  formParts.shift();
  formParts = formParts.map((el) => el.replace(/\r\n$/, ''));
  formParts = formParts.map((el) => el.replace(/^\r\n/, ''));

  const form = {};
  formParts.forEach((formPart) => {
    const regexMatch = formPart.match(/Content-Disposition: form-data; name="(\w*)"(?:[\S\s]*)?\r\n\r\n([\S\s]*)/);
    if (regexMatch) {
      const parameterName = regexMatch[1];
      form[parameterName] = regexMatch[2];
    }
  });
  return form;
};

export const fileUtils = {
  parseMultipartFormData,
};
