// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Typography } from '@mui/material';
import { PermissionsGate } from '@cosmotech/ui';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { useUserAppAndCurrentScenarioPermissions } from '../../../hooks/SecurityHooks';

const SaveLaunchDiscardButton = ({ save, launch, saveAndLauch, discard, isDirty, runDisabled }) => {
  const { t } = useTranslation();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        {isDirty && (
          <PermissionsGate
            userPermissions={userAppAndCurrentScenarioPermissions}
            necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
          >
            <Grid item>
              <Button data-cy="discard-button" startIcon={<CancelIcon />} onClick={discard}>
                <Typography variant="inherit">
                  {t('commoncomponents.button.scenario.parameters.discard', 'DISCARD ')}
                </Typography>
              </Button>
              <Button data-cy="save-button" startIcon={<SaveIcon />} onClick={save}>
                <Typography variant="inherit">
                  {t('commoncomponents.button.scenario.parameters.update.update', 'SAVE ')}
                </Typography>
              </Button>
            </Grid>
          </PermissionsGate>
        )}
        <Grid item>
          <PermissionsGate
            userPermissions={userAppAndCurrentScenarioPermissions}
            necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
          >
            <div>
              <Button
                data-cy="launch-scenario-button"
                variant="contained"
                disabled={runDisabled}
                startIcon={<PlayCircleOutlineIcon />}
                onClick={isDirty ? saveAndLauch : launch}
              >
                <Typography variant="inherit">
                  {isDirty
                    ? t('commoncomponents.button.scenario.parameters.update.launch', 'SAVE & LAUNCH ')
                    : t('commoncomponents.button.scenario.parameters.launch', 'LAUNCH')}
                </Typography>
              </Button>
            </div>
          </PermissionsGate>
        </Grid>
      </Grid>
    </div>
  );
};

SaveLaunchDiscardButton.propTypes = {
  save: PropTypes.func.isRequired,
  launch: PropTypes.func.isRequired,
  saveAndLauch: PropTypes.func.isRequired,
  discard: PropTypes.func.isRequired,
  isDirty: PropTypes.bool.isRequired,
  runDisabled: PropTypes.bool.isRequired,
};

export default SaveLaunchDiscardButton;
