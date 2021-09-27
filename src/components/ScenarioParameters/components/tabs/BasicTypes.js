// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import {
  BasicDateInput,
  BasicTextInput,
  BasicNumberInput,
  BasicEnumInput,
  BasicToggleInput
} from '@cosmotech/ui';

const BasicTypes = ({
  textFieldValue,
  changeTextField,
  numberFieldValue,
  changeNumberField,
  enumFieldValue,
  changeEnumField,
  switchFieldValue,
  changeSwitchType,
  selectedDate,
  changeSelectedDate,
  editMode
}) => {
  const textFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id'
  };

  const inputProps = {
    min: -999,
    max: 9999
  };

  const numberFieldsProps = {
    disabled: !editMode,
    id: 'basic-number-input-id'
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
    id: 'basic-enum-input-id'
  };

  const switchFieldProps = {
    disabled: !editMode,
    id: 'basic-switch-input-id'
  };

  const dateProps = {
    disabled: !editMode,
    id: 'basic-date-input-id',
    minDate: new Date('2014-01-01'),
    maxDate: new Date('2023-01-01'),
    minDateMessage: 'Minimum date is not respected',
    maxDateMessage: 'Maximum date is not respected',
    invalidDateMessage: 'Date is invalid'
  };

  return (
    <div>
      <BasicTextInput
        data-cy="basic-text-input"
        label='Text Field'
        changeTextField={changeTextField}
        textFieldProps={textFieldProps}
        value={textFieldValue}
      />
      <BasicNumberInput
        data-cy="basic-number-input"
        label='Number Field'
        changeNumberField={changeNumberField}
        textFieldProps={numberFieldsProps}
        value={numberFieldValue}
        inputProps={inputProps}
      />
      <BasicEnumInput
        data-cy="basic-enum-input"
        label='Enum Field'
        changeEnumField={changeEnumField}
        textFieldProps={enumFieldProps}
        value={enumFieldValue}
        enumValues={enumValues}
      />
      <BasicToggleInput
        label='Switch type'
        changeSwitchType={changeSwitchType}
        switchProps={switchFieldProps}
        checked={switchFieldValue}
      />
      <BasicDateInput
        label='Pick a date'
        changeSelectedDate={changeSelectedDate}
        dateProps={dateProps}
        value={selectedDate}
      />
    </div>
  );
};

BasicTypes.propTypes = {
  textFieldValue: PropTypes.string.isRequired,
  changeTextField: PropTypes.func.isRequired,
  numberFieldValue: PropTypes.number.isRequired,
  changeNumberField: PropTypes.func.isRequired,
  enumFieldValue: PropTypes.string.isRequired,
  changeEnumField: PropTypes.func.isRequired,
  switchFieldValue: PropTypes.bool.isRequired,
  changeSwitchType: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
  changeSelectedDate: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BasicTypes;
