// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { CreateScenarioButton as CreateScenarioButtonUI } from '@cosmotech/ui';
import { useEditScenarioButton } from './EditScenarioButtonHook';

const EditScenarioButton = ({ autoFocus, onClose, scenarioToEdit, variant = 'button' }) => {
  const { dialogLabels, disabled, updateScenario, sortedScenarioList } = useEditScenarioButton({
    scenarioToEdit,
  });

  return (
    <CreateScenarioButtonUI
      autoFocus={autoFocus}
      currentScenario={{ data: scenarioToEdit }}
      disabled={disabled}
      editMode
      labels={dialogLabels}
      onConfirm={updateScenario}
      onClose={onClose}
      scenarios={sortedScenarioList}
      variant={variant}
    />
  );
};

EditScenarioButton.propTypes = {
  autoFocus: PropTypes.bool,
  onClose: PropTypes.func,
  scenarioToEdit: PropTypes.object,
  variant: PropTypes.string,
};

export default EditScenarioButton;
