// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ACL_ROLES } from '../services/config/accessControl';

const _findById = (array, idToFind) => {
  return array.find((element) => element.id === idToFind);
};

const areAccessControlListsIdentical = (aclA = [], aclB = []) => {
  if (Object.keys(aclA).length !== Object.keys(aclB).length) return false;
  for (const userAccessA of aclA) {
    const userAccessB = _findById(aclB, userAccessA.id);
    if (userAccessB === undefined || userAccessA.role !== userAccessB.role) return false;
  }
  return true;
};

const compareAccessControlLists = (currentACL, newACL) => {
  const usersToAdd = [];
  const usersToModify = [];
  const usersToRemove = [];

  // Find new entries in ACL & changed roles
  for (const newACLUser of newACL) {
    const currentACLUser = _findById(currentACL, newACLUser.id);
    if (currentACLUser === undefined) {
      usersToAdd.push(newACLUser);
    } else if (currentACLUser.role !== newACLUser.role) {
      usersToModify.push(newACLUser);
    }
  }

  // Find entries removed from ACL
  for (const currentACLUser of currentACL) {
    const newACLUser = _findById(newACL, currentACLUser.id);
    if (newACLUser === undefined) usersToRemove.push(currentACLUser);
  }

  return { usersToAdd, usersToModify, usersToRemove };
};

const getUsersIdsFromACL = (acl) => {
  return acl.map((user) => user.id);
};

const sortByNewAdminsFirst = (usersToAddOrModify) => {
  return usersToAddOrModify.sort((userA, userB) => {
    if (userA.role === userB.role) return 0;
    if (userA.role === ACL_ROLES.SCENARIO.ADMIN) return -1;
    if (userB.role === ACL_ROLES.SCENARIO.ADMIN) return 1;
    return 0;
  });
};

// Parameters:
// - currentSecurity: current security object of the resource
// - newSecurity: new security object of the resource
// - setDefaultSecurity: callback function to update the resource default security, the expected signature is
//     async (newRole:string) => void
// - addAccess: callback function to add a new entry in the resource ACL, the expected signature is
//     async (newEntry:object) => void
// - updateAccess: callback function to update a user role in the resource ACL, the expected signature is
//     async (userIdToUpdate:string, newUserRole:string) => void
// - removeAccess: callback function to remove a user from the resource ACL, the expected signature is
//     async (userIdToRemove:string) => void
// Return value: true if the resource security has been changed, false otherwise.
const updateResourceSecurity = async (
  currentSecurity,
  newSecurity,
  setDefaultSecurity,
  addAccess,
  updateAccess,
  removeAccess
) => {
  let hasChanges = false;

  if (newSecurity.default && currentSecurity?.default !== newSecurity?.default) {
    hasChanges = true;
    await setDefaultSecurity(newSecurity.default);
  }

  if (!areAccessControlListsIdentical(newSecurity?.accessControlList, currentSecurity?.accessControlList)) {
    hasChanges = true;
    const { usersToAdd, usersToModify, usersToRemove } = compareAccessControlLists(
      currentSecurity?.accessControlList ?? [],
      newSecurity?.accessControlList ?? []
    );

    for (const userToAdd of usersToAdd) await addAccess(userToAdd);
    for (const userToModify of usersToModify) await updateAccess(userToModify.id, userToModify.role);

    const usersIdsToRemove = getUsersIdsFromACL(usersToRemove);
    for (const userIdToRemove of usersIdsToRemove) {
      await removeAccess(userIdToRemove);
    }
  }

  return hasChanges;
};

const forgeDatasetSecurityFromScenarioSecurity = (scenarioSecurity) => {
  const getDatasetRoleFromScenarioRole = (scenarioRole) =>
    scenarioRole === ACL_ROLES.SCENARIO.VALIDATOR ? ACL_ROLES.DATASET.EDITOR : scenarioRole;

  return {
    default: getDatasetRoleFromScenarioRole(scenarioSecurity.default),
    accessControlList: scenarioSecurity.accessControlList.map((aclEntry) => ({
      id: aclEntry.id,
      role: getDatasetRoleFromScenarioRole(aclEntry.role),
    })),
  };
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

const getPermissionsFromRole = (role, rolesToPermissionsMapping) => {
  if (role == null) {
    console.warn("Role is null or undefined, can't retrieve permissions.");
    return [];
  }
  if (rolesToPermissionsMapping == null) {
    console.warn("Mapping between roles and permissions is null or undefined, can't retrieve permissions.");
    return [];
  }
  return rolesToPermissionsMapping[typeof role === 'string' ? role.toLowerCase() : role] ?? [];
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

const getUserRoleForResource = (resourceSecurity, userIdentifier) => {
  if (resourceSecurity == null) {
    console.warn("Resource security is null or undefined, can't retrieve user role for resource.");
    return null;
  }
  if (userIdentifier == null) {
    console.warn("User identifier is null or undefined, can't get user role for resource.");
    return null;
  }
  // Check specific permissions by access control list
  if (resourceSecurity.accessControlList != null) {
    const acl = resourceSecurity.accessControlList;
    if (Array.isArray(acl)) {
      const specificUserSecurity = acl.find((aclUser) => aclUser.id.toLowerCase() === userIdentifier.toLowerCase());
      if (specificUserSecurity !== undefined) {
        return specificUserSecurity.role;
      }
    }
  }
  // If user is not specifically in ACL, return the default role of the resource
  return resourceSecurity.default ?? null;
};

const getUserPermissionsForResource = (resourceSecurity, userIdentifier, resourceRolesToPermissionsMapping) => {
  if (resourceSecurity == null) {
    console.warn("Resource security is null or undefined, can't retrieve user permissions.");
    return [];
  }
  if (Object.keys(resourceSecurity).length === 0) {
    console.warn("Resource security is an empty object, can't retrieve user permissions.");
    return [];
  }
  if (resourceRolesToPermissionsMapping == null) {
    console.warn("Mapping between roles and permissions is null or undefined, can't retrieve user permissions.");
    return [];
  }
  const userRoleForResource = getUserRoleForResource(resourceSecurity, userIdentifier);
  if (userRoleForResource === null) return [];
  return getPermissionsFromRole(userRoleForResource, resourceRolesToPermissionsMapping);
};

const _getRolesFromMapping = (permissionsMapping) => {
  return Object.keys(permissionsMapping);
};

const _getPermissionsFromMapping = (permissionsMapping) => {
  const permissionsSet = new Set();
  Object.values(permissionsMapping).forEach((permissions) =>
    permissions.forEach((permission) => permissionsSet.add(permission))
  );
  return Array.from(permissionsSet);
};

// Example of format for organization permissions:
// [
//   {
//     component: 'organization',
//     roles: {
//       none: [],
//       viewer: ['read', 'read_security'],
//       user: ['read', 'read_security', 'create_children'],
//     },
//   },
//   {
//     component: 'scenario',
//     roles: { ... },
//   },
// ];
const parseOrganizationPermissions = (organizationPermissions, addNoneRole = false) => {
  if (organizationPermissions == null) {
    console.warn("Organization permissions value is null or undefined, can't parse it.");
    return null;
  }
  if (!Array.isArray(organizationPermissions)) {
    console.error("Organization permissions value is not an array, can't parse it.");
    return null;
  }

  const roles = {};
  const permissions = {};
  const permissionsMapping = {};

  for (const componentPermissions of organizationPermissions) {
    const componentKey = componentPermissions.component;
    const mapping = componentPermissions.roles;
    roles[componentKey] = _getRolesFromMapping(mapping);
    permissions[componentKey] = _getPermissionsFromMapping(mapping);
    permissionsMapping[componentKey] = mapping;
  }

  if (addNoneRole === true) {
    for (const componentPermissions of organizationPermissions) {
      const componentKey = componentPermissions.component;
      !roles[componentKey].includes('none') && roles[componentKey].unshift('none');
      permissionsMapping[componentKey].none === undefined && (permissionsMapping[componentKey].none = []);
    }
  }

  return { roles, permissions, permissionsMapping };
};

const getRolesLabels = (t, rolesNames) => {
  const rolesLabels = [];
  rolesNames.forEach((roleName) =>
    rolesLabels.push({ value: roleName, label: t(`commoncomponents.dialog.share.roles.${roleName}`, roleName) })
  );
  return rolesLabels;
};

const getScenarioPermissionsLabels = (t, permissionsNames) => {
  const scenarioPermissionsLabels = [];
  permissionsNames.forEach((permissionName) =>
    scenarioPermissionsLabels.push({
      value: permissionName,
      label: t(`commoncomponents.dialog.share.permissions.${permissionName}`, permissionName),
    })
  );
  return scenarioPermissionsLabels;
};

const getDatasetPermissionsLabels = (t, permissionsNames) => {
  const datasetPermissionsLabels = [];
  permissionsNames.forEach((permissionName) =>
    datasetPermissionsLabels.push({
      value: permissionName,
      label: t(`commoncomponents.dialog.share.datasetPermissions.${permissionName}`, permissionName),
    })
  );
  return datasetPermissionsLabels;
};

export const SecurityUtils = {
  areAccessControlListsIdentical,
  compareAccessControlLists,
  forgeDatasetSecurityFromScenarioSecurity,
  getPermissionsFromRole,
  getRolesGrantingPermission,
  getUserPermissionsForResource,
  getUserRoleForResource,
  getUsersIdsFromACL,
  parseOrganizationPermissions,
  sortByNewAdminsFirst,
  transposeMappingDict,
  updateResourceSecurity,
  getRolesLabels,
  getScenarioPermissionsLabels,
  getDatasetPermissionsLabels,
};
