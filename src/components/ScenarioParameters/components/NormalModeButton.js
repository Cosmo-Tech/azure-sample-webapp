// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const NormalModeButton = ({ classes, handleClickOnEdit, handleClickOnLaunchScenario, editDisabled, runDisabled }) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
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
      </Grid>
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
  handleClickOnEdit: PropTypes.func.isRequired,
  handleClickOnLaunchScenario: PropTypes.func.isRequired,
  editDisabled: PropTypes.bool.isRequired,
  runDisabled: PropTypes.bool.isRequired,
};

export default NormalModeButton;
