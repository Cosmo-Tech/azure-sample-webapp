// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
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
  const editButton = (
    <IconButton data-cy="edit-parameters-button" color="primary" onClick={handleClickOnEdit} disabled={editDisabled}>
      <EditIcon />
    </IconButton>
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
        <IconButton
          data-cy="launch-scenario-button"
          color="primary"
          onClick={handleClickOnLaunchScenario}
          disabled={runDisabled}
        >
          <PlayCircleOutlineIcon />
        </IconButton>
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
