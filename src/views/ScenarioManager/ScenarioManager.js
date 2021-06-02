// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
}));

const ScenarioManager = (props) => {
  const classes = useStyles();
  return (
      <div className={classes.root}>
        SCENARIO MANAGER
      </div>
  );
};

export default ScenarioManager;
