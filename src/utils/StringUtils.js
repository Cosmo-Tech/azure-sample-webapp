// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const trimTrailingSlashes = (urlString) => {
  if (urlString == null) return;
  let end = urlString.length;
  while (end > 0 && urlString.endsWith('/', end)) end--;
  return urlString.slice(0, end);
};

export const StringUtils = {
  trimTrailingSlashes,
};
