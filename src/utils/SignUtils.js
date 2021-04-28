// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';

export const signIn = async (callback) => {
  if (Auth.isAsync()) {
    return Auth.isUserSignedIn(callback);
  } else {
    return Auth.isUserSignedIn();
  }
};
