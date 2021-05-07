// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Switch, Typography, withStyles } from '@material-ui/core';

const useStyles = theme => ({
  root: {
    flexGrow: 1
  }
});

const BasicToggleInput = (props) => {
  const { classes, label, containerProps, labelProps, switchProps } = props;
  const [checked, setChecked] = useState(switchProps.checked);

  const handleOnChange = () => setChecked(!checked);

  return (

      <Grid container className={classes.root} {...containerProps}>
          <Grid item >
              <Typography {...labelProps}>{label}</Typography>
          </Grid>
          <Grid item >
              <Switch onChange={handleOnChange} {...switchProps} />
          </Grid>
      </Grid>

  );
};

BasicToggleInput.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string.isRequired,
  containerProps: PropTypes.object.isRequired,
  labelProps: PropTypes.object.isRequired,
  switchProps: PropTypes.object.isRequired
};

export default withStyles(useStyles)(BasicToggleInput);
