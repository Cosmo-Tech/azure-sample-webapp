// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth, AuthDev } from '@cosmotech/core';

export const SHOW_DEV_AUTH_PROVIDER = window.location.hostname === 'localhost';

// Optional config for local fake dev account (can't be used to retrieve a valid token)
const AUTH_DEV_CONFIG = {
  // accountId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userEmail: 'dev.sample.webapp@example.com',
  // userId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userName: 'Dave Lauper',
  // roles: ['Organization.User'],
};

// Make the paremters above configurable through environment variables
if (process.env.REACT_APP_AUTH_DEV_ACCOUNT_ID) AUTH_DEV_CONFIG.accountId = process.env.REACT_APP_AUTH_DEV_ACCOUNT_ID;
if (process.env.REACT_APP_AUTH_DEV_USER_EMAIL) AUTH_DEV_CONFIG.userEmail = process.env.REACT_APP_AUTH_DEV_USER_EMAIL;
if (process.env.REACT_APP_AUTH_DEV_USER_ID) AUTH_DEV_CONFIG.userId = process.env.REACT_APP_AUTH_DEV_USER_ID;
if (process.env.REACT_APP_AUTH_DEV_USER_NAME) AUTH_DEV_CONFIG.userName = process.env.REACT_APP_AUTH_DEV_USER_NAME;
if (process.env.REACT_APP_AUTH_DEV_ROLE) AUTH_DEV_CONFIG.roles = [process.env.REACT_APP_AUTH_DEV_ROLE];

Auth.addProvider(AuthDev).setConfig(AUTH_DEV_CONFIG);
