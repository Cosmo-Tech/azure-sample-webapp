import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import { DeleteDatasetButton } from '../../../DeleteDatasetButton/DeleteDatasetButton';
import { RefreshDatasetButton } from '../RefreshDatasetButton/RefreshDatasetButton';

export default function DatasetActions({ dataset }) {
  return (
    <ButtonGroup>
      <RefreshDatasetButton dataset={dataset} />
      <DeleteDatasetButton dataset={dataset} location="dataset-actions-" />
    </ButtonGroup>
  );
}
DatasetActions.propTypes = {
  dataset: PropTypes.object.isRequired,
};
