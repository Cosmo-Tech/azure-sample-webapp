// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicDateInput, BasicTextInput, BasicNumberInput, BasicEnumTypes, BasicToggleInput } from '@cosmotech/ui';

const BasicTypes = ({
  classes,
  changeTextField,
  initTextFieldValue,
  changeNumberField,
  changeEnumField,
  changeSwitchType,
  changeSelectedDate,
  selectedDate,
  editMode
}) => {
  const textFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id',
    value: initTextFieldValue
  };

  const inputProps = {
    min: -999,
    max: 9999
  };

  const numberFieldsProps = {
    disabled: !editMode,
    id: 'basic-number-input-id',
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
    id: 'basic-enum-input-id',
    defaultValue: '€'
  };

  const switchFieldProps = {
    disabled: !editMode,
    id: 'basic-switch-input-id'
  };

  const dateProps = {
    disabled: !editMode,
    id: 'basic-date-input-id',
    value: selectedDate
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
          classes={classes}
          label='Switch type'
          changeSwitchType={changeSwitchType}
          switchProps={switchFieldProps}
        />
        <BasicDateInput
          classes={classes}
          label='Pick a date'
          changeSelectedDate={changeSelectedDate}
          dateProps={dateProps}
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
  changeSelectedDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BasicTypes;
