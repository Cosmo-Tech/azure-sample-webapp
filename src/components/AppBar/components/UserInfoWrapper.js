// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UserInfo } from '@cosmotech/ui';
import { Auth } from '@cosmotech/core';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../../config/Languages';
import { useUserInfoHook } from './hooks/UserInfoHook';

export const UserInfoWrapper = () => {
  const { t, i18n } = useTranslation();
  const labels = {
    language: t('genericcomponent.userinfo.button.change.language', 'Change language'),
    logOut: t('genericcomponent.userinfo.button.logout', 'Sign out'),
  };
  const { userName, userProfilePic } = useUserInfoHook();
  return (
    <UserInfo
      onLogout={Auth.signOut}
      changeLanguage={(lang) => i18n.changeLanguage(lang)}
      languages={LANGUAGES}
      language={i18n.language}
      userName={userName}
      labels={labels}
      profilePlaceholder={userProfilePic}
    />
  );
};
