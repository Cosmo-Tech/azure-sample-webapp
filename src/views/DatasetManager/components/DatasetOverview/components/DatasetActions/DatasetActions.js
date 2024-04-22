import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShareDatasetButton from '../../../../../../components/ShareDatasetButton/ShareDatasetButton';
import { CreateSubDatasetButton } from '../../../CreateDatasetButton';
import { DeleteDatasetButton } from '../../../DeleteDatasetButton';
import { RefreshDatasetButton } from '../RefreshDatasetButton';

export default function DatasetActions({ dataset }) {
  if (dataset == null) return null;
  return (
    <ButtonGroup>
      <RefreshDatasetButton dataset={dataset} />
      <CreateSubDatasetButton parentDataset={dataset} />
      <ShareDatasetButton dataset={dataset} />
      <DeleteDatasetButton dataset={dataset} location="dataset-actions-" />
    </ButtonGroup>
  );
}

DatasetActions.propTypes = {
  dataset: PropTypes.object,
};
