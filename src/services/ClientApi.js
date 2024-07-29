// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import axios from 'axios';
import { Auth } from '@cosmotech/core';

const getAuthenticationHeaders = async (allowApiKey = false) => {
  if (allowApiKey && process.env.REACT_APP_API_KEY) return { 'X-CSM-API-KEY': process.env.REACT_APP_API_KEY };

  const tokens = await Auth.acquireTokens();
  if (tokens?.accessToken) return { Authorization: 'Bearer ' + tokens.accessToken };

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
