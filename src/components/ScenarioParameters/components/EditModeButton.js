// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import BackspaceIcon from '@material-ui/icons/Backspace';

const EditModeButton = ({ classes, handleClickOnDiscardChange, handleClickOnUpdateAndLaunchScenario }) => {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <IconButton data-cy="discard-button" color="primary" onClick={handleClickOnDiscardChange}>
          <BackspaceIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton data-cy="update-and-launch-scenario" color="primary" onClick={handleClickOnUpdateAndLaunchScenario}>
          <PlayCircleOutlineIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

EditModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  handleClickOnDiscardChange: PropTypes.func.isRequired,
  handleClickOnUpdateAndLaunchScenario: PropTypes.func.isRequired,
};

export default EditModeButton;
