// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Grid, TextField, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = theme => ({
  root: {
    flexGrow: 1
  }
});

const BasicTypes = ({ classes }) => {
  const containerProps = {
    direction: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    spacing: 2
  };

  const labelProps = {
    variant: 'subtitle2'
  };

  const inputProps = {
    disabled: false,
    id: 'standard-required',
    defaultValue: 'Default Value'
  };

  return (<TextInput classes={classes} label='Test Label' containerProps={containerProps} inputProps={inputProps} labelProps={labelProps}/>);
};

BasicTypes.propTypes = {
  classes: PropTypes.any
};

const TextInput = (props) => {
  const { classes, label, containerProps, labelProps, inputProps } = props;
  return (
        <Grid container className={classes.root} {...containerProps}>
            <Grid item >
                <Typography {...labelProps}>{label}</Typography>
            </Grid>
            <Grid item >
                <TextField {...inputProps} />
            </Grid>
        </Grid>
  );
};

TextInput.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string.isRequired,
  containerProps: PropTypes.object.isRequired,
  labelProps: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired
};

export default withStyles(useStyles)(BasicTypes);
