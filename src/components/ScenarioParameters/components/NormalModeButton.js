// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Fade, Grid, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { useUserAppAndCurrentScenarioPermissions } from '../../../hooks/SecurityHooks.js';
import { PermissionsGate } from '@cosmotech/ui';

const NormalModeButton = ({
  classes,
  handleClickOnEdit,
  handleClickOnLaunchScenario,
  editDisabled,
  runDisabled,
  disabledEditTooltip,
}) => {
  const { t } = useTranslation();
  const userAppAndCurrentScenarioPermissions = useUserAppAndCurrentScenarioPermissions();

  const editButton = (
    <IconButton
      data-cy="edit-parameters-button"
      color="primary"
      onClick={handleClickOnEdit}
      disabled={editDisabled}
      size="large"
    >
      <EditIcon />
    </IconButton>
  );

  const editButtonTooltipWrapper =
    disabledEditTooltip && disabledEditTooltip.length > 0 ? (
      <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={disabledEditTooltip}>
        <div>{editButton}</div>
      </Tooltip>
    ) : (
      <Tooltip
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        title={t('commoncomponents.button.scenario.parameters.edit', 'Edit parameters')}
      >
        <div>{editButton}</div>
      </Tooltip>
    );

  return (
    <Grid container spacing={1} alignItems="center">
      <PermissionsGate
        userPermissions={userAppAndCurrentScenarioPermissions}
        necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.WRITE]}
      >
        <Grid item>{editButtonTooltipWrapper}</Grid>
      </PermissionsGate>
      <Grid item>
        <PermissionsGate
          userPermissions={userAppAndCurrentScenarioPermissions}
          necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.LAUNCH]}
        >
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title={t('commoncomponents.button.scenario.parameters.launch', 'Launch scenario')}
          >
            <div>
              <IconButton
                data-cy="launch-scenario-button"
                color="primary"
                onClick={handleClickOnLaunchScenario}
                disabled={runDisabled}
                size="large"
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            </div>
          </Tooltip>
        </PermissionsGate>
      </Grid>
    </Grid>
  );
};

NormalModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  disabledEditTooltip: PropTypes.string,
  handleClickOnEdit: PropTypes.func.isRequired,
  handleClickOnLaunchScenario: PropTypes.func.isRequired,
  editDisabled: PropTypes.bool.isRequired,
  runDisabled: PropTypes.bool.isRequired,
};

NormalModeButton.defaultProps = {
  disabledEditTooltip: undefined,
};

export default NormalModeButton;
