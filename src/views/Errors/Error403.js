// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorPage } from '../../components/ErrorPage';

export const Error403 = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage
      code="403"
      title={t('views.403.title')}
      description={t('views.403.errormessage')}
      onBack={() => window.history.back()}
      backLabel={t('commoncomponents.button.errorPage.back')}
    />
  );
};
