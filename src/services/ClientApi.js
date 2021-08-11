// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';

import { Auth } from '@cosmotech/core';

const addInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (request) => {
      const tokens = await Auth.acquireTokens();
      if (tokens?.accessToken) {
        request.headers.common.Authorization = 'Bearer ' + tokens.accessToken;
        return request;
      }
      Auth.signOut();
    },
    (error) => {
      console.error(error);
    }
  );
  return axiosInstance;
};

const axiosClientApi = addInterceptors(axios.create());

export { axiosClientApi as clientApi };
