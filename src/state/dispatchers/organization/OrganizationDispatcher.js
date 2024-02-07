// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Redux Action (equivalent to dispatch function)
import { ORGANIZATION_ACTIONS_KEY } from '../../commons/OrganizationConstants';

export const dispatchGetOrganizationById = (payLoad) => ({
  type: ORGANIZATION_ACTIONS_KEY.GET_ORGANIZATION_BY_ID,
  ...payLoad,
});

export const dispatchGetAllOrganizations = (payLoad) => ({
  type: ORGANIZATION_ACTIONS_KEY.GET_ALL_ORGANIZATIONS,
  ...payLoad,
});
