// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ListingHeader
        title={t('layouts.tabs.scenario.tab.title')}
        subtitle={t('layouts.tabs.scenario.tab.description')}
        buttonLabel={t('layouts.tabs.scenario.tab.create')}
        onButtonClick={onCreateScenario}
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
            title={t('layouts.tabs.scenario.tab.emptyStateTitle') + ' 🙁'}
            subtitle={t('layouts.tabs.scenario.tab.emptyState')}
            buttonLabel={t('layouts.tabs.scenario.tab.create')}
            onButtonClick={onCreateScenario}
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
