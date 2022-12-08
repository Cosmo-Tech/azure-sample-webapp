// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { USERS_LIST } from '../../cypress/fixtures/stubbing/default';
export { USERS_LIST };

export const USERS_EMAIL_LIST = USERS_LIST.map((user) => user.email);
