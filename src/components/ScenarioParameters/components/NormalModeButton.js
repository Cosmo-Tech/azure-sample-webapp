// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fade, Grid, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
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
  const userAppPermissions = useSelector((state) => state.auth.permissions);
  const currentScenario = useSelector((state) => state.scenario.current.data);
  const userPermissionsOnCurrentScenario = currentScenario?.security?.currentUserPermissions || [];
  const userAppAndScenarioPermissions = userAppPermissions.concat(userPermissionsOnCurrentScenario);

  const editButton = (
    <IconButton data-cy="edit-parameters-button" color="primary" onClick={handleClickOnEdit} disabled={editDisabled}>
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
        userPermissions={userAppAndScenarioPermissions}
        necessaryPermissions={[ACL_PERMISSIONS.SCENARIO.EDIT_PARAMETERS]}
      >
        <Grid item>{editButtonTooltipWrapper}</Grid>
      </PermissionsGate>
      <Grid item>
        <PermissionsGate
          userPermissions={userAppAndScenarioPermissions}
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
