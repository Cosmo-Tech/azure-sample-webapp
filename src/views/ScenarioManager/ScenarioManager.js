// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
});

const ScenarioManager = (props) => {
  return (
      <div className={props.classes.root}>
        SCENARIO MANAGER
      </div>
  );
};

ScenarioManager.propTypes = {
  classes: PropTypes.any
};

export default withStyles(useStyles)(ScenarioManager);
