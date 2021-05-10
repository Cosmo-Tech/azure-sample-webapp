// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Grid, MenuItem, TextField, Typography, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = theme => ({
  root: {
    flexGrow: 1
  }
});

const BasicEnumInput = (props) => {
  const { classes, label, containerProps, labelProps, textFieldProps, enumValues, changeEnumField } = props;

  // REQUIREMENT: the keyValueMap cannot have duplicate values to work
  const getKeyFromValue = (value, keyValueMap) => {
    let key = '';
    for (const keyValue of keyValueMap) {
      if (keyValue.value === value) {
        key = keyValue.key;
        break;
      }
    }
    return key;
  };

  return (
        <Grid container className={classes.root} {...containerProps}>
            <Grid item >
                <Typography {...labelProps}>{label}</Typography>
            </Grid>
            <Grid item >
                <TextField
                    select
                    {...textFieldProps}
                    onChange={(event) => changeEnumField(getKeyFromValue(event.target.value, enumValues))}
                >
                    {enumValues.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                            {option.value}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
  );
};

BasicEnumInput.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string.isRequired,
  containerProps: PropTypes.object.isRequired,
  labelProps: PropTypes.object.isRequired,
  textFieldProps: PropTypes.object.isRequired,
  changeEnumField: PropTypes.func.isRequired,
  enumValues: PropTypes.array.isRequired
};

export default withStyles(useStyles)(BasicEnumInput);
