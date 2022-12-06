// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { useUserAppAndCurrentScenarioPermissions } from '../../../hooks/SecurityHooks.js';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';

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
    <IconButton data-cy="edit-parameters-button" color="primary" onClick={handleClickOnEdit} disabled={editDisabled}>
      <EditIcon />
    </IconButton>
  );

  const editButtonTooltipWrapper =
    disabledEditTooltip && disabledEditTooltip.length > 0 ? (
      <FadingTooltip title={disabledEditTooltip}>{editButton}</FadingTooltip>
    ) : (
      <FadingTooltip title={t('commoncomponents.button.scenario.parameters.edit', 'Edit parameters')}>
        {editButton}
      </FadingTooltip>
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
          <FadingTooltip title={t('commoncomponents.button.scenario.parameters.launch', 'Launch scenario')}>
            <IconButton
              data-cy="launch-scenario-button"
              color="primary"
              onClick={handleClickOnLaunchScenario}
              disabled={runDisabled}
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          </FadingTooltip>
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
