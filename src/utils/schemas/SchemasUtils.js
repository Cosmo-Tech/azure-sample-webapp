// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { z } from 'zod';

const getCustomOptionsZodObject = (optionsList = []) => {
  let customOptions = {};
  if (Array.isArray(optionsList))
    optionsList
      .flat(Infinity)
      .forEach((option) => (customOptions = { ...customOptions, [option]: z.unknown().optional().nullable() }));
  return z.object({ ...customOptions });
};

const patchConfigWithCustomOptions = (basicOptions, customOptionsList) => {
  return getCustomOptionsZodObject(customOptionsList).merge(basicOptions).strict().optional().nullable();
};

export const SchemasUtils = {
  getCustomOptionsZodObject,
  patchConfigWithCustomOptions,
};
