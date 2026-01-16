// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { jwtDecode } from 'jwt-decode';
import { GET_SUPERSET_GUEST_TOKEN_URL } from '../../state/charts/constants';
import { clientApi, getAuthenticationHeaders } from '../ClientApi';
import ConfigService from '../ConfigService';
import { ENV } from '../config/EnvironmentVariables';

const getUserFriendlyError = (axiosError) => {
  // In dev mode, the local proxy might return an error 500 when the Function App is not started.
  if (ENV.DEV && axiosError?.code === 'ERR_BAD_RESPONSE')
    return {
      title: 'Failed to get Superset guest token',
      message: (axiosError?.message ?? '') + '. Is the local Function App running?',
      status: 'Network error',
    };

  const error = axiosError?.response?.data?.error;

  return {
    title: 'Failed to get Superset guest token',
    message: error?.powerBIErrorInfo ?? error?.description ?? axiosError?.message,
    status: error?.status ?? error?.statusText ?? axiosError?.response?.status ?? axiosError?.code,
  };
};

const getSupersetGuestToken = async (organizationId, workspaceId, dashboardIds) => {
  try {
    const headers = await getAuthenticationHeaders(false);
    const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';

    const response = await clientApi.post(
      `${publicUrl}${GET_SUPERSET_GUEST_TOKEN_URL}`,
      { organizationId, workspaceId, dashboardIds },
      { headers: { 'csm-authorization': headers.Authorization } }
    );

    const token = response?.data?.token;
    if (typeof response !== 'object' || token == null) {
      const errorMessage =
        'Unexpected type for Superset guest token. Something probably went wrong during the query redirection to ' +
        'the Function App';
      const error = new Error('Network error');
      error.response = { status: 'Network error', data: { message: errorMessage } };
      return { token: null, expiry: null, error };
    }

    let expiry = null;
    try {
      const decoded = jwtDecode(token);
      expiry = decoded.exp ? decoded.exp * 1000 : null;
    } catch (err) {
      console.warn('Failed to decode Superset guest token expiry:', err);
    }

    return { token, expiry, error: null };
  } catch (error) {
    console.error('Error fetching Superset guest token:', error);
    const userFriendlyError = getUserFriendlyError(error);
    return { token: null, expiry: null, error: userFriendlyError };
  }
};

export const SupersetService = {
  getSupersetGuestToken,
};
