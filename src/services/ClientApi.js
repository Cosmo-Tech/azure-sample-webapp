// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '@cosmotech/core';
import { SESSION_TOKEN_REFRESH_TRESHOLD } from './config/FunctionalConstants';

const getAuthenticationHeaders = async (allowApiKey = false) => {
  if (allowApiKey && process.env.REACT_APP_API_KEY) return { 'X-CSM-API-KEY': process.env.REACT_APP_API_KEY };

  let tokens = await Auth.acquireTokens();
  if (tokens?.accessToken) {
    const accessData = jwtDecode(tokens.accessToken);
    const expiryDate = accessData.exp;
    const remainingTimeInMinutes = Math.floor((expiryDate - Date.now() / 1000) / 60);
    if (remainingTimeInMinutes <= SESSION_TOKEN_REFRESH_TRESHOLD) {
      tokens = await Auth.refreshTokens();
    }
    if (tokens?.accessToken) return { Authorization: 'Bearer ' + tokens.accessToken };
  }

  console.error('Failed to retrieve an access token. Logging out...');
  Auth.signOut();
};

const addInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (request) => {
      const authenticationHeaders = await getAuthenticationHeaders(true);
      request.headers = {
        ...request.headers,
        ...authenticationHeaders,
      };
      return request;
    },
    (error) => {
      console.error(error);
    }
  );
  return axiosInstance;
};

const axiosClientApi = addInterceptors(axios.create());

export { axiosClientApi as clientApi, getAuthenticationHeaders };
