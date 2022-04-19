// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const NormalModeButton = ({
  classes,
  handleClickOnEdit,
  handleClickOnLaunchScenario,
  editDisabled,
  runDisabled,
  disabledEditTooltip,
}) => {
  const { t } = useTranslation();
  const editButton = (
    <Button
      data-cy="edit-parameters-button"
      startIcon={<EditIcon />}
      variant="contained"
      color="primary"
      onClick={handleClickOnEdit}
      disabled={editDisabled}
    >
      {t('commoncomponents.button.scenario.parameters.edit', 'Edit')}
    </Button>
  );

  const editButtonTooltipWrapper =
    disabledEditTooltip && disabledEditTooltip.length > 0 ? (
      <Tooltip title={disabledEditTooltip}>
        <span>{editButton}</span>
      </Tooltip>
    ) : (
      editButton
    );

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>{editButtonTooltipWrapper}</Grid>
      <Grid item>
        <Button
          data-cy="launch-scenario-button"
          startIcon={<PlayCircleOutlineIcon />}
          variant="contained"
          color="primary"
          onClick={handleClickOnLaunchScenario}
          disabled={runDisabled}
        >
          {t('commoncomponents.button.scenario.parameters.launch', 'Launch Scenario')}
        </Button>
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
