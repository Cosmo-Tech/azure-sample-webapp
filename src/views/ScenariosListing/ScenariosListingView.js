// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { ScenarioListing } from '../../components/ScenarioListing';
import { useSortedScenarioList } from '../../hooks/ScenarioListHooks';

export const ScenariosListingView = () => {
  const sortedScenarioList = useSortedScenarioList();

  const handleEditDataset = useCallback((dataset) => {
    console.log('TODO: open Edit Dataset modal:', dataset);
  }, []);

  const handleShareDataset = useCallback((dataset) => {
    console.log('TODO: open Share modal:', dataset);
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScenarioListing
        scenarios={sortedScenarioList}
        onEditDataset={handleEditDataset}
        onShareDataset={handleShareDataset}
      />
    </Box>
  );
};

export default ScenariosListingView;
