// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBanner } from '@cosmotech/ui';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/app/hooks';

export const ApplicationErrorBanner = () => {
  const { t } = useTranslation();

  const applicationError = useApplicationError();
  const clearApplicationErrorMessage = useClearApplicationErrorMessage();

  return (
    <ErrorBanner
      error={applicationError}
      labels={{
        dismissButtonText: t('commoncomponents.banner.button.dismiss', 'Dismiss'),
        tooLongErrorMessage: t(
          'commoncomponents.banner.tooLongErrorMessage',
          'Detailed error message is too long to be displayed. ' +
            'To read it, please use the COPY button and paste it in your favorite text editor.'
        ),
        secondButtonText: t('commoncomponents.banner.button.copy.label', 'Copy'),
        toggledButtonText: t('commoncomponents.banner.button.copy.copied', 'Copied'),
      }}
      clearErrors={clearApplicationErrorMessage}
    />
  );
};
