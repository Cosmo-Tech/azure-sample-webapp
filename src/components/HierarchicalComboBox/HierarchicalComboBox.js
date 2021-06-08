// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Tooltip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getFormattedOptionsList } from './utils';

const HierarchicalComboBox = ({
  values,
  label,
  disabled,
  handleChange,
  separator,
  maxCharLength,
  renderInputToolType,
  ...props
}) => {
  const optionsList = [];
  getFormattedOptionsList(optionsList, values, 0, separator, maxCharLength);

  return (
    <Autocomplete
        {...props}
      disableClearable
      disabled={disabled}
      onChange={(event, node) => (handleChange(event, node))}
      options={optionsList}
      getOptionLabel={(option) => Object.keys(option).length !== 0 ? option.name : ''}
      getOptionSelected={(option, value) => option.id === value.id}
      renderOption={(option) => (
          <span
            data-testid={'option-' + option.id}
            style={{ marginLeft: option.depth * 20 }}
          >
            {option.fullName}
          </span>
      )}
      renderInput={(params) => (
        <Tooltip arrow title={renderInputToolType}>
          <TextField
            {...params}
            placeholder={label}
            label={label}
            variant="outlined"
          />
        </Tooltip>
      )}
    />
  );
};

HierarchicalComboBox.propTypes = {
  label: PropTypes.string,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  values: PropTypes.array,
  separator: PropTypes.string,
  maxCharLength: PropTypes.number,
  renderInputToolType: PropTypes.string
};

HierarchicalComboBox.defaultProps = {
  disabled: false,
  separator: ' ... ',
  maxCharLength: -1,
  renderInputToolType: ''
};

export default HierarchicalComboBox;
