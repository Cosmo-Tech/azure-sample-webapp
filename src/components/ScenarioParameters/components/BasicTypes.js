// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicTextInput, BasicNumberInput, BasicEnumTypes, BasicToggleInput } from '@cosmotech/ui';

const BasicTypes = ({ classes, changeTextField, initTextFieldValue, changeNumberField, changeEnumField, changeSwitchType, editMode }) => {
  const textFieldProps = {
    disabled: !editMode,
    id: 'standard-required',
    value: initTextFieldValue
  };

  const inputProps = {
    min: -999,
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
          textFieldProps={textFieldProps}
        />
        <BasicNumberInput
          classes={classes}
          label='Number Field'
          changeNumberField={changeNumberField}
          textFieldProps={numberFieldsProps}
          inputProps={inputProps}
        />
        <BasicEnumTypes
          classes={classes}
          label='Enum Field'
          changeEnumField={changeEnumField}
          textFieldProps={enumFieldProps}
          enumValues={enumValues}
        />
        <BasicToggleInput
          changeSwitchType={changeSwitchType}
          classes={classes}
          label='Switch type'
          switchProps={switchFieldProps}
        />
      </div>);
};

BasicTypes.propTypes = {
  classes: PropTypes.any,
  initTextFieldValue: PropTypes.string.isRequired,
  changeTextField: PropTypes.func.isRequired,
  changeNumberField: PropTypes.func.isRequired,
  changeEnumField: PropTypes.func.isRequired,
  changeSwitchType: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BasicTypes;
