// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getByDataCy = (dataCy, parent = document) => {
  return parent.querySelector(`[data-cy="${dataCy}"]`);
};
