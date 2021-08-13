// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Button
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

const EditModeButton = ({ classes, handleClickOnDiscardChange, handleClickOnUpdateAndLaunchScenario }) => {
  const { t } = useTranslation();
  return (
        <Grid container spacing={1}>
          <Grid item>
            <Button
              color="primary"
              onClick={handleClickOnDiscardChange}>
              {t('commoncomponents.button.scenario.parameters.discard', 'Discard Modifications')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              data-cy="update-and-launch-scenario"
              startIcon={<PlayCircleOutlineIcon />}
              variant="contained"
              color="primary"
              onClick={handleClickOnUpdateAndLaunchScenario}>
              {t('commoncomponents.button.scenario.parameters.update.launch', 'Update And Launch Scenario')}
            </Button>
          </Grid>
        </Grid>
  );
};

EditModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  handleClickOnDiscardChange: PropTypes.func.isRequired,
  handleClickOnUpdateAndLaunchScenario: PropTypes.func.isRequired
};

export default EditModeButton;
