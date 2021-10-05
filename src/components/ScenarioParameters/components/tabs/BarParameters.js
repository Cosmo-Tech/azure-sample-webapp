// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { BasicNumberInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';

const BarParameters = ({
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
    id: 'basic-text-input-id'
  };
  const restockQuantityTextFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id'
  };
  const waitersNumberTextFieldProps = {
    disabled: !editMode,
    id: 'basic-text-input-id'
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
          data-cy="stock-input"
          label={ t('genericcomponent.text.scenario.parameters.bar.stock', 'Stock') }
          changeNumberField={changeStock}
          textFieldProps={stockTextFieldProps}
          value={stock}
          inputProps={stockInputProps}
        />
        <BasicNumberInput
          data-cy="restock-input"
          label={ t('genericcomponent.text.scenario.parameters.bar.restock', 'Restock quantity') }
          changeNumberField={changeRestockQuantity}
          textFieldProps={restockQuantityTextFieldProps}
          value={restockQuantity}
          inputProps={restockQuantityInputProps}
        />
        <BasicNumberInput
          data-cy="waiters-input"
          label={ t('genericcomponent.text.scenario.parameters.bar.waiters', 'Waiters number') }
          changeNumberField={changeWaitersNumber}
          textFieldProps={waitersNumberTextFieldProps}
          value={waitersNumber}
          inputProps={waitersNumberInputProps}
        />
      </div>);
};

BarParameters.propTypes = {
  stock: PropTypes.number.isRequired,
  changeStock: PropTypes.func.isRequired,
  restockQuantity: PropTypes.number.isRequired,
  changeRestockQuantity: PropTypes.func.isRequired,
  waitersNumber: PropTypes.number.isRequired,
  changeWaitersNumber: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default BarParameters;
