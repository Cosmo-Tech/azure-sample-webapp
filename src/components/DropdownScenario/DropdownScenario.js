// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';

const useStyles = theme => ({
  textfield: {
    borderColor: '#FFFFFF'
  }
});

const DropdownScenario = (props) => {
  const { t } = useTranslation();

  const { scenarioTree } = props;
  const scenarioOptions = [];
  const getScenarioOption = (scenarioOptions, node, depth) => {
    for (const sc of node) {
      const option = { ...sc };
      option.optionLabel = '\xa0'.repeat(depth * 3) + sc.name;
      scenarioOptions.push(option);
      if (sc.children.length > 0) {
        getScenarioOption(scenarioOptions, sc.children, depth + 1);
      }
    }
  };
  getScenarioOption(scenarioOptions, scenarioTree.data, 0);

  return (
    <Autocomplete
      disableClearable
      disabled={props.disabled}
      onChange={(event, newScenario) => (props.handleChange(event, newScenario, 'dropDownScenario')) }
      options={scenarioOptions}
      getOptionLabel={(option) => option.optionLabel }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t(props.label)}
          label={t(props.label)}
          variant="outlined"
        />
      )}
    />
  );
};

DropdownScenario.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  scenarioTree: PropTypes.Object
};

DropdownScenario.defaultProps = {
  disabled: false
};

export default withStyles(useStyles)(DropdownScenario);
