// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const isString = (value) => typeof value === 'string' || value instanceof String;

const isValidCosmoResourceId = (value) => {
  if (!isString(value)) return false;
  // Vague length and regex checks on purpose to match strings with the pattern "wxyz-0a1b2c3de_..."
  if (value.length < 1 || value.length > 20) return false;
  return /^[a-z]+-[a-z0-9_]+$/.test(value);
};

module.exports = {
  isString,
  isValidCosmoResourceId,
};
