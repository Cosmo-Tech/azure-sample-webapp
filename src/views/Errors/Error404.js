// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorPage } from '../../components/ErrorPage';

export const Error404 = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage
      code="404"
      title={t('views.404.title')}
      description={t('views.404.errormessage')}
      onBack={() => window.history.back()}
      backLabel={t('commoncomponents.button.errorPage.back')}
      homeLabel={t('commoncomponents.button.errorPage.home')}
    />
  );
};
