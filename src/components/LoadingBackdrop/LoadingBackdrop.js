// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { STATUSES } from '../../services/config/StatusConstants';

const LoadingBackdrop = ({ status }) => {
  const { t } = useTranslation();
  const showBackdrop = status === STATUSES.LOADING || status === STATUSES.SAVING;

  return (
    <Backdrop data-cy="scenario-backdrop" open={showBackdrop} style={{ zIndex: '10000' }}>
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <CircularProgress data-cy="scenario-loading-spinner" color="inherit" />
        {status === STATUSES.SAVING && (
          <Typography data-cy="scenario-backdrop-saving-text" variant="h4">
            {t('genericcomponent.text.scenario.saving', 'Saving your data')}
          </Typography>
        )}
      </Stack>
    </Backdrop>
  );
};

LoadingBackdrop.propTypes = {
  status: PropTypes.string.isRequired,
};

export default LoadingBackdrop;
