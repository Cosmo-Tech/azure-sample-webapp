// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Grid, TextField, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = theme => ({
  root: {
    flexGrow: 1
  }
});

const BasicNumberInput = (props) => {
  const { classes, label, containerProps, labelProps, textFieldProps, inputProps } = props;
  return (
        <Grid container className={classes.root} {...containerProps}>
            <Grid item >
                <Typography {...labelProps}>{label}</Typography>
            </Grid>
            <Grid item >
                <TextField
                    type="number"
                    inputProps={inputProps}
                    {...textFieldProps} />
            </Grid>
        </Grid>
  );
};

BasicNumberInput.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string.isRequired,
  containerProps: PropTypes.object.isRequired,
  labelProps: PropTypes.object.isRequired,
  textFieldProps: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired
};

export default withStyles(useStyles)(BasicNumberInput);
