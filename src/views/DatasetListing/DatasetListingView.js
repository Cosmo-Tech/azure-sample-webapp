// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo, useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { ResourceUtils } from '@cosmotech/core';
import { DatasetListing } from '../../components/DatasetListing';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useDatasetList } from '../DatasetManager/components/DatasetList/DatasetListHook';

export const DatasetListingView = () => {
  const {
    datasets,
    selectDataset,
    deleteDataset,
    userPermissionsInCurrentOrganization,
    isDatasetCopyEnabledInWorkspace,
  } = useDatasetList();

  const [searchString, setSearchString] = useState('');

  const sortedDatasetList = useMemo(() => ResourceUtils.sortResourceListByName(datasets), [datasets]);

  const filteredDatasets = useMemo(() => {
    if (!searchString) return sortedDatasetList;

    return sortedDatasetList.filter((dataset) => {
      const s = searchString.toLowerCase();
      return dataset.name.toLowerCase().includes(s) || dataset.tags?.some((tag) => tag.toLowerCase().includes(s));
    });
  }, [sortedDatasetList, searchString]);

  // CREATE
  const handleCreateDataset = useCallback(() => {
    console.log('TODO: open Create Dataset modal');
  }, []);

  // EDIT
  const handleEditDataset = useCallback((dataset) => {
    console.log('TODO: open Edit Dataset modal:', dataset);
  }, []);

  // COPY
  const handleCopyDataset = useCallback(
    (dataset) => {
      if (!isDatasetCopyEnabledInWorkspace) return;
      console.log('Copy dataset:', dataset);
    },
    [isDatasetCopyEnabledInWorkspace]
  );

  // SHARE
  const handleShareDataset = useCallback((dataset) => {
    console.log('TODO: open Share modal:', dataset);
  }, []);

  // DELETE
  const handleDeleteDataset = useCallback(
    (dataset) => {
      deleteDataset(dataset.id);
    },
    [deleteDataset]
  );

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
        datasets={filteredDatasets}
        onCreateDataset={
          userPermissionsInCurrentOrganization.includes(ACL_PERMISSIONS.ORGANIZATION.CREATE_CHILDREN)
            ? handleCreateDataset
            : undefined
        }
        onSelectDataset={selectDataset}
        onEditDataset={handleEditDataset}
        onCopyDataset={isDatasetCopyEnabledInWorkspace ? handleCopyDataset : undefined}
        onShareDataset={handleShareDataset}
        onDeleteDataset={handleDeleteDataset}
        onSearch={setSearchString}
      />
    </Box>
  );
};

export default DatasetListingView;
