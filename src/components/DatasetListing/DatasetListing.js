// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useWorkspaceMainDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { DatasetListingHeader } from './components/DatasetListingHeader';
import { DatasetListingEmpty } from './components/DatasetListingEmpty';
import { DatasetListingTable } from './components/DatasetListingTable';

export const DatasetListing = ({ onCreateDataset, onEditDataset, onCopyDataset, onShareDataset, onDeleteDataset, datasets: datasetsProp }) => {
  const datasetsFromHook = useWorkspaceMainDatasets() ?? [];
  const datasets = datasetsProp ?? datasetsFromHook;

  const isEmpty = datasets.length === 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FAFAFA',
      }}
    >
      <DatasetListingHeader onCreateDataset={onCreateDataset} />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 3,
          py: 3,
        }}
      >
        {isEmpty ? (
          <DatasetListingEmpty onCreateDataset={onCreateDataset} />
        ) : (
          <DatasetListingTable
            datasets={datasets}
            onEditDataset={onEditDataset}
            onCopyDataset={onCopyDataset}
            onShareDataset={onShareDataset}
            onDeleteDataset={onDeleteDataset}
          />
        )}
      </Box>
    </Box>
  );
};

DatasetListing.propTypes = {
  onCreateDataset: PropTypes.func,
  onEditDataset: PropTypes.func,
  onCopyDataset: PropTypes.func,
  onShareDataset: PropTypes.func,
  onDeleteDataset: PropTypes.func,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
      updateInfo: PropTypes.shape({
        timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
      status: PropTypes.string,
      security: PropTypes.shape({
        currentUserPermissions: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ),
};

DatasetListing.defaultProps = {
  onCreateDataset: undefined,
  onEditDataset: undefined,
  onCopyDataset: undefined,
  onShareDataset: undefined,
  onDeleteDataset: undefined,
  datasets: undefined,
};

