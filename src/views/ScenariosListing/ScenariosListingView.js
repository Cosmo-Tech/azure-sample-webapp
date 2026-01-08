// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { DeleteScenarioModal } from '../../components';
import { useCreateScenarioButton } from '../../components/CreateScenarioButton/CreateScenarioButtonHook';
import { ScenarioListing } from '../../components/ScenarioListing';
import { useSortedScenarioList } from '../../hooks/ScenarioListHooks';
import { useDeleteRunner } from '../../state/runner/hooks';

export const ScenariosListingView = () => {
  const sortedScenarioList = useSortedScenarioList();
  const { createScenario, workspaceId } = useCreateScenarioButton({});
  const deleteRunner = useDeleteRunner();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);

  const handleCreateScenario = (form) => {
    const scenarioData = {
      name: form.name,
      description: form.description,
      datasetList: form.datasets,
    };
    createScenario(workspaceId, scenarioData);
  };

  const handleEditDataset = useCallback((dataset) => {
    console.log('TODO: open Edit Dataset modal:', dataset);
  }, []);

  const handleShareDataset = useCallback((dataset) => {
    console.log('TODO: open Share modal:', dataset);
  }, []);

  const handleDeleteScenario = useCallback((scenario) => {
    setScenarioToDelete(scenario);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (scenarioToDelete) {
      deleteRunner(scenarioToDelete.id);
      setScenarioToDelete(null);
    }
  }, [deleteRunner, scenarioToDelete]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setScenarioToDelete(null);
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
        onCreateScenario={handleCreateScenario}
        onEditDataset={handleEditDataset}
        onShareDataset={handleShareDataset}
        onDeleteScenario={handleDeleteScenario}
      />
      <DeleteScenarioModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        scenarioName={scenarioToDelete?.name}
      />
    </Box>
  );
};

export default ScenariosListingView;
