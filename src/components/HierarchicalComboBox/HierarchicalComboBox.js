// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import { getFormattedOptionsList } from './utils';
import { withStyles } from '@material-ui/styles';

const useStyles = theme => ({
});

const HierarchicalComboBox = ({ values, label, disabled, handleChange, separator, maxCharLength, ...props }) => {
  const { t } = useTranslation();

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
        <React.Fragment>
          <span
            data-testid={'option-' + option.id}
            style={{ marginLeft: option.depth * 20 }}
          >
            {option.fullName}
          </span>
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t(label)}
          label={t(label)}
          variant="outlined"
        />
      )}
    />
  );
};

HierarchicalComboBox.propTypes = {
  classes: PropTypes.any,
  label: PropTypes.string,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  values: PropTypes.array,
  separator: PropTypes.string,
  maxCharLength: PropTypes.number
};

HierarchicalComboBox.defaultProps = {
  disabled: false,
  separator: ' ... ',
  maxCharLength: -1
};

export default withStyles(useStyles)(HierarchicalComboBox);
