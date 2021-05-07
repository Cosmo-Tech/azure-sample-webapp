// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicTextInput, BasicNumberInput, BasicEnumTypes, BasicToggleInput } from '../BasicInputs';

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

  const enumValues = [
    {
      value: 'USD',
      label: '$'
    },
    {
      value: 'EUR',
      label: '€'
    },
    {
      value: 'BTC',
      label: '฿'
    },
    {
      value: 'JPY',
      label: '¥'
    }
  ];

  const enumFieldProps = {
    disabled: false,
    id: 'standard-required',
    defaultValue: 'EUR'
  };

  const switchFieldProps = {
    disabled: false,
    id: 'standard-required',
    checked: true
  };

  return (
      <div>
        <BasicTextInput classes={classes} label='Text Field' containerProps={containerProps} textFieldProps={textFieldProps} labelProps={labelProps}/>
        <BasicNumberInput classes={classes} label='Number Field' containerProps={containerProps} textFieldProps={numberFieldsProps} inputProps={inputProps} labelProps={labelProps}/>
        <BasicEnumTypes classes={classes} label='Enum Field' containerProps={containerProps} textFieldProps={enumFieldProps} enumValues={enumValues} labelProps={labelProps}/>
        <BasicToggleInput labelProps={labelProps} containerProps={containerProps} classes={classes} label='Switch type' switchProps={switchFieldProps} />
      </div>);
};

BasicTypes.propTypes = {
  classes: PropTypes.any
};

export default BasicTypes;
