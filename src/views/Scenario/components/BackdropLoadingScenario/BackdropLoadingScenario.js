// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { useBackdropLoadingScenario } from './BackdropLoadingScenarioHooks';
import { STATUSES } from '../../../../state/commons/Constants';
import { useTranslation } from 'react-i18next';

const BackdropLoadingScenario = () => {
  const { currentScenarioStatus } = useBackdropLoadingScenario();
  const { t } = useTranslation();
  const showBackdrop = currentScenarioStatus === STATUSES.LOADING || currentScenarioStatus === STATUSES.SAVING;

  return (
    <Backdrop data-cy="scenario-backdrop" open={showBackdrop} style={{ zIndex: '10000' }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress data-cy="scenario-loading-spinner" color="inherit" />
        {currentScenarioStatus === STATUSES.SAVING && (
          <Typography data-cy="scenario-backdrop-saving-text" variant="h4">
            {t('genericcomponent.text.scenario.saving', 'Saving your data')}
          </Typography>
        )}
      </Stack>
    </Backdrop>
  );
};

export default BackdropLoadingScenario;
