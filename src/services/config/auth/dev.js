// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth, AuthDev } from '@cosmotech/core';
import { ENV } from '../EnvironmentVariables';

export const SHOW_DEV_AUTH_PROVIDER = window.location.hostname === 'localhost';

// Optional config for local fake dev account (can't be used to retrieve a valid token)
const AUTH_DEV_CONFIG = {
  // accountId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userEmail: 'dev.sample.webapp@example.com',
  // userId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userName: 'Dave Lauper',
  // roles: ['Organization.User'],
};

// Make the parameters above configurable through environment variables
if (ENV.VITE_AUTH_DEV_ACCOUNT_ID) AUTH_DEV_CONFIG.accountId = ENV.VITE_AUTH_DEV_ACCOUNT_ID;
if (ENV.VITE_AUTH_DEV_USER_EMAIL) AUTH_DEV_CONFIG.userEmail = ENV.VITE_AUTH_DEV_USER_EMAIL;
if (ENV.VITE_AUTH_DEV_USER_ID) AUTH_DEV_CONFIG.userId = ENV.VITE_AUTH_DEV_USER_ID;
if (ENV.VITE_AUTH_DEV_USER_NAME) AUTH_DEV_CONFIG.userName = ENV.VITE_AUTH_DEV_USER_NAME;
if (ENV.VITE_AUTH_DEV_ROLE) AUTH_DEV_CONFIG.roles = [ENV.VITE_AUTH_DEV_ROLE];

Auth.addProvider(AuthDev).setConfig(AUTH_DEV_CONFIG);
