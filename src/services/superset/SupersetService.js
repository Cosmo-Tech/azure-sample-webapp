// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GET_SUPERSET_GUEST_TOKEN_URL } from '../../state/charts/constants';
import { clientApi, getAuthenticationHeaders } from '../ClientApi';
import ConfigService from '../ConfigService';
import { handleServiceAccountError } from './errors';

const getSupersetGuestToken = async (organizationId, workspaceId, dashboardIds) => {
  try {
    const headers = await getAuthenticationHeaders(false);
    const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';

    const response = await clientApi.post(
      `${publicUrl}${GET_SUPERSET_GUEST_TOKEN_URL}`,
      {
        organizationId,
        workspaceId,
        dashboardIds,
      },
      { headers: { 'csm-authorization': headers.Authorization } }
    );

    return {
      token: response?.data?.token,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching Superset guest token:', error);
    return {
      token: null,
      error: handleServiceAccountError(error),
    };
  }
};

export const SupersetService = {
  getSupersetGuestToken,
};
