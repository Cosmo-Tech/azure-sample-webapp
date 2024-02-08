// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { USERS_LIST, USER_EXAMPLE } from '../../cypress/fixtures/stubbing/default';

export { USERS_LIST, USER_EXAMPLE };

export const USERS_EMAIL_LIST = USERS_LIST.map((user) => user.email);
