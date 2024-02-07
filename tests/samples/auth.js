// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USER_EXAMPLE } from './users';

export const USER_AUTH_ADMIN = {
  error: '',
  userEmail: USER_EXAMPLE.email,
  userId: USER_EXAMPLE.id,
  userName: USER_EXAMPLE.name,
  roles: ['Platform.Admin'],
  permissions: [],
  status: 'AUTHENTICATED',
};
