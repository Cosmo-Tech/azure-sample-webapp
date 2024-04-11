import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import { CreateSubDatasetButton } from '../../../CreateDatasetButton';
import { DeleteDatasetButton } from '../../../DeleteDatasetButton';
import { RefreshDatasetButton } from '../RefreshDatasetButton';

export default function DatasetActions({ dataset }) {
  return (
    <ButtonGroup>
      <RefreshDatasetButton dataset={dataset} />
      <CreateSubDatasetButton parentDatasetId={dataset?.id} />
      <DeleteDatasetButton dataset={dataset} location="dataset-actions-" />
    </ButtonGroup>
  );
}

DatasetActions.propTypes = {
  dataset: PropTypes.object.isRequired,
};
