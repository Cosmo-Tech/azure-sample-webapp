import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import { DeleteDatasetButton } from '../../../DeleteDatasetButton/DeleteDatasetButton';

export default function DatasetActions({ dataset }) {
  return (
    <ButtonGroup>
      <DeleteDatasetButton dataset={dataset} location="dataset-actions-" />
    </ButtonGroup>
  );
}
DatasetActions.propTypes = {
  dataset: PropTypes.object.isRequired,
};
