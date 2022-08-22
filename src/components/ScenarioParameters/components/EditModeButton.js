// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fade, Grid, IconButton, Tooltip } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS, APP_PERMISSIONS } from '../../../services/config/accessControl';
import { PermissionsGate } from '@cosmotech/ui';

const EditModeButton = ({ classes, handleClickOnDiscardChange, handleClickOnUpdateAndLaunchScenario }) => {
  const { t } = useTranslation();
  const userAppPermissions = useSelector((state) => state.auth.permissions);
  const currentScenario = useSelector((state) => state.scenario.current.data);
  const userPermissionsOnCurrentScenario = currentScenario?.security?.currentUserPermissions || [];
  const userAppAndScenarioPermissions = userAppPermissions.concat(userPermissionsOnCurrentScenario);

  return (
    <PermissionsGate
      userPermissions={userAppAndScenarioPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.EDIT_PARAMETERS, APP_PERMISSIONS.SCENARIO.EDIT_PARAMETERS]}
      sufficientPermissions={[APP_PERMISSIONS.ADMIN]}
    >
      <Grid container spacing={1}>
        <Grid item>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title={t('commoncomponents.button.scenario.parameters.discard', 'Discard changes')}
          >
            <IconButton data-cy="discard-button" color="primary" onClick={handleClickOnDiscardChange}>
              <BackspaceIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title={t('commoncomponents.button.scenario.parameters.update.launch', 'Update and launch')}
          >
            <IconButton
              data-cy="update-and-launch-scenario"
              color="primary"
              onClick={handleClickOnUpdateAndLaunchScenario}
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </PermissionsGate>
  );
};

EditModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  handleClickOnDiscardChange: PropTypes.func.isRequired,
  handleClickOnUpdateAndLaunchScenario: PropTypes.func.isRequired,
};

export default EditModeButton;
