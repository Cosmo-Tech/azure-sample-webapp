// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { STATUSES } from '../../../../services/config/StatusConstants';
import { useBackdropLoadingScenario } from './BackdropLoadingScenarioHooks';

const BackdropLoadingScenario = () => {
  const { currentScenarioStatus, showBackdrop } = useBackdropLoadingScenario();
  const { t } = useTranslation();

  return (
    <Backdrop data-cy="scenario-backdrop" open={showBackdrop} style={{ zIndex: '10000' }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
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
