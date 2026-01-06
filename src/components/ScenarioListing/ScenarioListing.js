// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import CreateNewScenarioModal from '../CreateNewScenarioModal/CreateNewScenarioModal';
import { ListingEmpty, ListingHeader } from '../ListingData';
import { ScenariosListingTable } from './components';

export const ScenarioListing = ({
  onCreateScenario,
  onEditScenario,
  onCopyScenario,
  onShareScenario,
  onDeleteScenario,
  scenarios,
}) => {
  const isEmpty = scenarios?.length === 0;
  const { t } = useTranslation();

  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const handleOpenScenarioModal = () => setScenarioModalOpen(true);
  const handleCloseScenarioModal = () => setScenarioModalOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ListingHeader
        title={t('layouts.tabs.scenario.tab.title', 'Scenarios')}
        subtitle={t('layouts.tabs.scenario.tab.description', 'Create, edit, share and delete your scenarios')}
        buttonLabel={t('layouts.tabs.scenario.tab.create', 'Create Scenario')}
        onButtonClick={handleOpenScenarioModal}
      />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 2,
          backgroundColor: (theme) => theme.palette.background.background01.main,
        }}
      >
        {isEmpty ? (
          <ListingEmpty
            title={t('layouts.tabs.scenario.tab.emptyStateTitle', "It's looking a bit empty here") + ' 🙁'}
            subtitle={t(
              'layouts.tabs.scenario.tab.emptyState',
              'There are no scenarios yet. If you have a dataset you can create a new scenario.'
            )}
            buttonLabel={t('layouts.tabs.scenario.tab.create', 'Create Scenario')}
            onButtonClick={handleOpenScenarioModal}
          />
        ) : (
          <ScenariosListingTable
            scenarios={scenarios}
            onEditScenario={onEditScenario}
            onCopyScenario={onCopyScenario}
            onShareScenario={onShareScenario}
            onDeleteScenario={onDeleteScenario}
          />
        )}
      </Box>
      <CreateNewScenarioModal open={scenarioModalOpen} onClose={handleCloseScenarioModal} onSubmit={onCreateScenario} />
    </Box>
  );
};

ScenarioListing.propTypes = {
  onCreateScenario: PropTypes.func,
  onEditScenario: PropTypes.func,
  onCopyScenario: PropTypes.func,
  onShareScenario: PropTypes.func,
  onDeleteScenario: PropTypes.func,
  scenarios: PropTypes.arrayOf(
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
