// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import ConfigService from '../services/ConfigService';

const getLocationRelativePath = (path) => {
  const routerBasename = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  return path.startsWith(routerBasename) ? path.substring(routerBasename.length) : path;
};

export const RouterUtils = {
  getLocationRelativePath,
};
