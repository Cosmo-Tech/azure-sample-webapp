// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TranslationUtils } from './TranslationUtils';

const _reshapeConfigDictToArray = (elementsDict) => {
  const elementsArray = [];
  for (const elementId in elementsDict) {
    const element = elementsDict[elementId];
    element.id = elementId;
    elementsArray.push(element);
  }
  return elementsArray;
};

const _addTranslationParametersGroupsLabels = (config) => {
  const parametersGroupsDict = config?.parametersGroups || {};
  TranslationUtils.addTranslationParametersGroupsLabels(_reshapeConfigDictToArray(parametersGroupsDict));
};

const _addTranslationParametersLabels = (config) => {
  const parametersDict = config?.parameters || {};
  TranslationUtils.addTranslationParametersLabels(_reshapeConfigDictToArray(parametersDict));
};

export const addTranslationLabels = (config) => {
  _addTranslationParametersGroupsLabels(config);
  _addTranslationParametersLabels(config);
};

const buildExtendedVarType = (varType, extension) => {
  if (varType) {
    if (extension) {
      return varType + '-' + extension;
    }
    return varType;
  }
  return undefined;
};

function getConversionMethod(param, subType, functionArray) {
  const varType = param?.varType;
  if (functionArray) {
    const extendedVarType = ConfigUtils.buildExtendedVarType(varType, subType);
    if (extendedVarType in functionArray) {
      return functionArray[extendedVarType];
    } else if (varType in functionArray) {
      return functionArray[varType];
    }
  }
  console.warn(
    `No conversion function (to/from string) defined for varType "${varType} or subType ${subType} in ${functionArray}"`
  );
  return undefined;
}

const getParameterSubType = (parameterId, configParameters) => {
  return configParameters?.[parameterId]?.subType;
};

/*
Transpose a dict whose values are arrays into another dict where the arrays values are now the dict keys.
Example: { A: [1,2,3], B:[1,2] } will become { 1:['A','B'], 2:['A','B'], 3:['A'] }
*/
const transposeMappingDict = (mappingDict) => {
  if (mappingDict == null) {
    console.warn("Mapping dict is null or undefined, can't transpose it.");
    return {};
  }

  // Fill new object with sets
  const newDict = {};
  for (const [originalKey, originalValueArray] of Object.entries(mappingDict)) {
    if (!Array.isArray(originalValueArray)) {
      console.error("Can't transpose mapping dict: value is not an array");
    }
    originalValueArray.forEach((itemInOriginalValue) => {
      if (!(itemInOriginalValue in newDict)) newDict[itemInOriginalValue] = new Set();
      newDict[itemInOriginalValue].add(originalKey);
    });
  }
  // Convert sets to arrays
  for (const [key, value] of Object.entries(newDict)) {
    newDict[key] = Array.from(value);
  }
  return newDict;
};

const getPermissionsFromRoles = (roles, rolesToPermissionsMapping) => {
  if (roles == null) {
    console.warn("List of roles is null or undefined, can't retrieve permissions.");
    return [];
  }
  if (rolesToPermissionsMapping == null) {
    console.warn("Mapping between roles and permissions is null or undefined, can't retrieve permissions.");
    return [];
  }

  const permissionsSet = new Set();
  roles
    .map((roleKey) => rolesToPermissionsMapping[roleKey] || [])
    .forEach((userPermissions) => {
      userPermissions.forEach((permission) => permissionsSet.add(permission));
    });
  return Array.from(permissionsSet);
};

// Given a permission name and a roles to permissions mapping, this function returns the list of roles granting the
// provided permission
const getRolesGrantingPermission = (permission, rolesToPermissionsMapping) => {
  if (permission == null) {
    console.warn("Permission is null or undefined, can't retrieve associated roles.");
    return [];
  }
  if (rolesToPermissionsMapping == null) {
    console.warn(
      "Mapping between roles and permissions is null or undefined, can't retrieve roles granting permission."
    );
    return [];
  }

  const permissionsToRoleDict = transposeMappingDict(rolesToPermissionsMapping);
  const rolesGrantingPermission = permissionsToRoleDict[permission];
  if (rolesGrantingPermission == null) {
    console.warn(`Permission ${permission} not found in mapping. Can't find roles granting this permission.`);
    return [];
  }
  return rolesGrantingPermission;
};

const getUserRolesForResource = (resourceSecurity, userIdentifier) => {
  if (userIdentifier == null) {
    console.warn("User identifier is null or undefined, can't get user roles for resource.");
    return [];
  }
  // Check specific permissions by access control list
  if (resourceSecurity?.accessControlList != null) {
    const acl = resourceSecurity?.accessControlList;
    if (Array.isArray(acl)) {
      const specificUserSecurity = acl.find((aclUser) => aclUser.id === userIdentifier);
      if (specificUserSecurity !== undefined) {
        return specificUserSecurity.roles;
      }
    }
  }
  // If user is not specifically in ACL, return the default roles of the resource
  const defaultRoles = resourceSecurity?.default;
  if (defaultRoles != null) return defaultRoles;
  return [];
};

const getUserPermissionsForResource = (resourceSecurity, userIdentifier, resourceRolesToPermissionsMapping) => {
  const userRolesForResource = getUserRolesForResource(resourceSecurity, userIdentifier);
  return getPermissionsFromRoles(userRolesForResource, resourceRolesToPermissionsMapping);
};

export const ConfigUtils = {
  addTranslationLabels,
  buildExtendedVarType,
  getConversionMethod,
  getParameterSubType,
  getPermissionsFromRoles,
  getRolesGrantingPermission,
  getUserRolesForResource,
  getUserPermissionsForResource,
  transposeMappingDict,
};
