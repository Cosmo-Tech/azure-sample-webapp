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
import { useFormState } from 'react-hook-form';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { useUserAppAndCurrentScenarioPermissions } from '../../../hooks/SecurityHooks';
import { useCurrentScenarioData } from '../../../state/hooks/ScenarioHooks';
import { SCENARIO_RUN_STATE } from '../../../services/config/ApiConstants';

const SaveLaunchDiscardButton = ({ onSave, onLaunch, onSaveAndLaunch, onDiscard }) => {
  const { t } = useTranslation();
  const { isDirty } = useFormState();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();
  const currentScenarioData = useCurrentScenarioData();

  const isCurrentScenarioRunning =
    currentScenarioData?.state === SCENARIO_RUN_STATE.RUNNING ||
    currentScenarioData?.state === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS;

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        {isDirty && (
          <PermissionsGate
            userPermissions={userAppAndCurrentScenarioPermissions}
            necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
          >
            <Grid item>
              <Button data-cy="discard-button" startIcon={<CancelIcon />} onClick={onDiscard}>
                <Typography variant="inherit">
                  {t('commoncomponents.button.scenario.parameters.discard', 'DISCARD ')}
                </Typography>
              </Button>
              <Button data-cy="save-button" startIcon={<SaveIcon />} onClick={onSave}>
                <Typography variant="inherit">
                  {t('commoncomponents.button.scenario.parameters.save', 'SAVE ')}
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
                disabled={isCurrentScenarioRunning}
                startIcon={<PlayCircleOutlineIcon />}
                onClick={isDirty ? onSaveAndLaunch : onLaunch}
              >
                <Typography variant="inherit">
                  {isDirty
                    ? t('commoncomponents.button.scenario.parameters.update.launch', 'SAVE AND LAUNCH ')
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
  onSave: PropTypes.func.isRequired,
  onLaunch: PropTypes.func.isRequired,
  onSaveAndLaunch: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
};

export default SaveLaunchDiscardButton;
