// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useApplicationError, useClearApplicationErrorMessage } from '../../state/app/hooks';
import StatusBar from '../StatusBar';

export const ApplicationErrorBanner = () => {
  const applicationError = useApplicationError();
  const clearApplicationErrorMessage = useClearApplicationErrorMessage();

  if (!applicationError) {
    return null;
  }

  return (
    <StatusBar
      status="invalid"
      size="full"
      message={applicationError.title}
      tooltip={applicationError.comment}
      onClose={clearApplicationErrorMessage}
    />
  );
};
