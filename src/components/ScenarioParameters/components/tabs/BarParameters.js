// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicNumberInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';

const BasicTypes = ({
  stock,
  changeStock,
  restockQuantity,
  changeRestockQuantity,
  waitersNumber,
  changeWaitersNumber,
  editMode
}) => {
  const { t } = useTranslation();

  // Number input properties configuration
  const stockTextFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id',
    value: stock
  };
  const restockQuantityTextFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id',
    value: restockQuantity
  };
  const waitersNumberTextFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id',
    value: waitersNumber
  };

  const stockInputProps = {
    min: 0,
    max: 9999
  };
  const restockQuantityInputProps = {
    min: -1,
    max: 9999
  };
  const waitersNumberInputProps = {
    min: 0,
    max: 20
  };

  return (
      <div>
        <BasicNumberInput
          label={ t('genericcomponent.text.scenario.parameters.bar.stock', 'Stock') }
          changeNumberField={changeStock}
          textFieldProps={stockTextFieldProps}
          inputProps={stockInputProps}
        />
        <BasicNumberInput
          label={ t('genericcomponent.text.scenario.parameters.bar.restock', 'Restock quantity') }
          changeNumberField={changeRestockQuantity}
          textFieldProps={restockQuantityTextFieldProps}
          inputProps={restockQuantityInputProps}
        />
        <BasicNumberInput
          label={ t('genericcomponent.text.scenario.parameters.bar.waiters', 'Waiters number') }
          changeNumberField={changeWaitersNumber}
          textFieldProps={waitersNumberTextFieldProps}
          inputProps={waitersNumberInputProps}
        />
      </div>);
};

BasicTypes.propTypes = {
  stock: PropTypes.number.isRequired,
  changeStock: PropTypes.func.isRequired,
  restockQuantity: PropTypes.number.isRequired,
  changeRestockQuantity: PropTypes.func.isRequired,
  waitersNumber: PropTypes.number.isRequired,
  changeWaitersNumber: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BasicTypes;
