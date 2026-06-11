// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const parseMultipartFormData = (dataString) => {
  const toUtf8String = (data) => {
    if (typeof data === 'string') return data;
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    if (ArrayBuffer.isView(data)) {
      if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(data);
      if (typeof Buffer !== 'undefined')
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString('utf8');
      return String.fromCharCode.apply(null, Array.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength)));
    }
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) return data.toString('utf8');
    return String(data);
  };

  dataString = toUtf8String(dataString);

  const boundary = dataString.split('\r\n')[0];
  let formParts = dataString.split(boundary);
  formParts.pop();
  formParts.shift();
  formParts = formParts.map((el) => el.replace(/\r\n$/, ''));
  formParts = formParts.map((el) => el.replace(/^\r\n/, ''));

  const form = {};
  formParts.forEach((formPart) => {
    const regexMatch = formPart.match(/Content-Disposition: form-data; name="(\w*)"(?:[\S\s]*)?\r\n\r\n([\S\s]*)/);
    if (!regexMatch) return;
    const parameterName = regexMatch[1];
    form[parameterName] = regexMatch[2];
  });
  return form;
};

export const fileUtils = {
  parseMultipartFormData,
};
