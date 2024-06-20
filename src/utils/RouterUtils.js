// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const getLocationRelativePath = (path) => {
  const routerBasename = process.env.PUBLIC_URL ?? '';
  return path.startsWith(routerBasename) ? path.substring(routerBasename.length) : path;
};

export const RouterUtils = {
  getLocationRelativePath,
};
