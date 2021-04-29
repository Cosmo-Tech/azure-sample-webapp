// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicTextInput, BasicNumberInput } from '../BasicInputs';

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

  const textFieldProps = {
    disabled: false,
    id: 'standard-required',
    defaultValue: 'Default Value'
  };

  const inputProps = {
    min: 0,
    max: 9999
  };

  const numberFieldsProps = {
    disabled: false,
    id: 'standard-required',
    defaultValue: 1000
  };

  return (
      <div>
        <BasicTextInput classes={classes} label='Text Field' containerProps={containerProps} textFieldProps={textFieldProps} labelProps={labelProps}/>
        <BasicNumberInput classes={classes} label='Number Field' containerProps={containerProps} textFieldProps={numberFieldsProps} inputProps={inputProps} labelProps={labelProps}/>
      </div>);
};

BasicTypes.propTypes = {
  classes: PropTypes.any
};

export default BasicTypes;
