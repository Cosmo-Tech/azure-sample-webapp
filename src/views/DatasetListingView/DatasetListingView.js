// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Box } from '@mui/material';
import { DatasetListing } from '../../components/DatasetListing';
import mockDatasets from './mockDatasets.json';

export const DatasetListingView = () => {
  const handleCreateDataset = () => {
    console.log('Create Dataset clicked');
  };

  const handleEditDataset = (dataset) => {
    console.log('Edit Dataset:', dataset);
  };

  const handleCopyDataset = (dataset) => {
    console.log('Copy Dataset:', dataset);
  };

  const handleShareDataset = (dataset) => {
    console.log('Share Dataset:', dataset);
  };

  const handleDeleteDataset = (dataset) => {
    console.log('Delete Dataset:', dataset);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DatasetListing
        datasets={mockDatasets}
        onCreateDataset={handleCreateDataset}
        onEditDataset={handleEditDataset}
        onCopyDataset={handleCopyDataset}
        onShareDataset={handleShareDataset}
        onDeleteDataset={handleDeleteDataset}
      />
    </Box>
  );
};

export default DatasetListingView;

