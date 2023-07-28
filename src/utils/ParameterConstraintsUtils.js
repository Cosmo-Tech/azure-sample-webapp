// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const operatorsDict = {
  date: ['>', '<', '>=', '<=', '==', '!='],
  number: ['>', '<', '>=', '<=', '==', '!='],
  int: ['>', '<', '>=', '<=', '==', '!='],
  string: ['==', '!='],
  bool: ['==', '!='],
};

const getIsVarTypesComparisonValid = (varType, varTypeToCompare) => {
  const numberVarTypes = ['int', 'number'];
  return varType === varTypeToCompare || [varType, varTypeToCompare].every((el) => numberVarTypes.includes(el));
};

const getParameterValidationConstraint = (validationString, varType, parametersList) => {
  if (validationString) {
    const [operator, id] = validationString.replace(/\s+/g, ' ').trim().split(' ');
    if (id === undefined) return null;
    const varTypeToCompare = Array.isArray(parametersList)
      ? parametersList?.find((parameter) => parameter.id === id)?.varType
      : null;
    const isVarTypesComparisonValid = getIsVarTypesComparisonValid(varType, varTypeToCompare);
    if (operatorsDict[varType]?.includes(operator) && isVarTypesComparisonValid) {
      return { operator, id };
    }
  }
  return null;
};

export const ParameterConstraintsUtils = {
  getParameterValidationConstraint,
  getIsVarTypesComparisonValid,
};
