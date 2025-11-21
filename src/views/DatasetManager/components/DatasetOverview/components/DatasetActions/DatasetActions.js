import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShareDatasetButton from '../../../../../../components/ShareDatasetButton/ShareDatasetButton';
import { CreateSubDatasetButton } from '../../../CreateDatasetButton';
import { DeleteDatasetButton } from '../../../DeleteDatasetButton';
import { UpdateDatasetButton } from '../../../UpdateDatasetButton';
import { RefreshDatasetButton } from '../RefreshDatasetButton';

export default function DatasetActions({ dataset }) {
  if (dataset == null) return null;
  // FIXME: use additionalData when it's available to check the type of the dataset
  return (
    <ButtonGroup>
      <RefreshDatasetButton dataset={dataset} />
      {dataset?.additionalData?.webapp?.sourceType === 'ETL' && <UpdateDatasetButton dataset={dataset} />}
      <CreateSubDatasetButton parentDataset={dataset} />
      <ShareDatasetButton dataset={dataset} />
      <DeleteDatasetButton dataset={dataset} location="dataset-actions-" />
    </ButtonGroup>
  );
}

DatasetActions.propTypes = {
  dataset: PropTypes.object,
};
