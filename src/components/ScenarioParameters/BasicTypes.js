// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicTextInput, BasicNumberInput, BasicEnumTypes, BasicToggleInput } from '../BasicInputs';

const BasicTypes = ({ classes, changeTextField, changeNumberField, changeEnumField, changeSwitchType, editMode }) => {
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
    disabled: !editMode,
    id: 'standard-required',
    defaultValue: 'Default Value'
  };

  const inputProps = {
    min: 0,
    max: 9999
  };

  const numberFieldsProps = {
    disabled: !editMode,
    id: 'standard-required',
    defaultValue: 1000
  };

  const enumValues = [
    {
      key: 'USD',
      value: '$'
    },
    {
      key: 'EUR',
      value: '€'
    },
    {
      key: 'BTC',
      value: '฿'
    },
    {
      key: 'JPY',
      value: '¥'
    }
  ];

  const enumFieldProps = {
    disabled: !editMode,
    id: 'standard-required',
    defaultValue: '€'
  };

  const switchFieldProps = {
    disabled: !editMode,
    id: 'standard-required'
  };

  return (
      <div>
        <BasicTextInput
          classes={classes}
          label='Text Field'
          changeTextField={changeTextField}
          containerProps={containerProps}
          textFieldProps={textFieldProps}
          labelProps={labelProps}
        />
        <BasicNumberInput
          classes={classes}
          label='Number Field'
          changeNumberField={changeNumberField}
          containerProps={containerProps}
          textFieldProps={numberFieldsProps}
          inputProps={inputProps}
          labelProps={labelProps}
        />
        <BasicEnumTypes
          classes={classes}
          label='Enum Field'
          changeEnumField={changeEnumField}
          containerProps={containerProps}
          textFieldProps={enumFieldProps}
          enumValues={enumValues}
          labelProps={labelProps}
        />
        <BasicToggleInput
          labelProps={labelProps}
          changeSwitchType={changeSwitchType}
          containerProps={containerProps}
          classes={classes}
          label='Switch type'
          switchProps={switchFieldProps}
        />
      </div>);
};

BasicTypes.propTypes = {
  classes: PropTypes.any,
  changeTextField: PropTypes.func.isRequired,
  changeNumberField: PropTypes.func.isRequired,
  changeEnumField: PropTypes.func.isRequired,
  changeSwitchType: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BasicTypes;
