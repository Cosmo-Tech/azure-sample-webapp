// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserInfo } from '@cosmotech/ui';
import ConfigService from '../../../services/ConfigService';
import { useUserInfoHook } from './hooks/UserInfoHook';

export const UserInfoWrapper = () => {
  const { t, i18n } = useTranslation();
  const labels = {
    language: t('genericcomponent.userinfo.button.change.language', 'Change language'),
    logOut: t('genericcomponent.userinfo.button.logout', 'Sign out'),
  };
  const { userProfilePic, userEmail, logOut } = useUserInfoHook();

  return (
    <UserInfo
      onLogout={logOut}
      changeLanguage={(lang) => i18n.changeLanguage(lang)}
      languages={ConfigService.getParameterValue('LANGUAGES')}
      language={i18n.language}
      userName={userEmail}
      labels={labels}
      profilePlaceholder={userProfilePic}
    />
  );
};
