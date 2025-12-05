// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useWorkspaceMainDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { useUserEmail } from '../../state/auth/hooks';
import { ListingEmpty, ListingHeader } from '../ListingData';
import { DatasetListingTable } from './components/DatasetListingTable';

export const DatasetListing = ({
  onCreateDataset,
  onEditDataset,
  onCopyDataset,
  onShareDataset,
  onDeleteDataset,
  datasets: datasetsProp,
}) => {
  const datasetsFromHook = useWorkspaceMainDatasets() ?? [];
  const datasets = datasetsProp ?? datasetsFromHook;
  const userEmail = useUserEmail();
  const isEmpty = datasets.length === 0;
  const { t } = useTranslation();

  const userName = React.useMemo(() => {
    if (userEmail) {
      const parts = userEmail.split('@')[0].split('.');
      if (parts.length >= 2) {
        return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
      return userEmail.split('@')[0];
    }
    return 'Anonymous';
  }, [userEmail]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ListingHeader
        title={t('layouts.tabs.data.tab.title')}
        subtitle={t('layouts.tabs.data.tab.description')}
        buttonLabel={t('layouts.tabs.data.tab.create')}
        onButtonClick={onCreateDataset}
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
            title={<>Hey {userName}! 👋</>}
            subtitle={t('layouts.tabs.data.tab.emptyState')}
            buttonLabel={t('layouts.tabs.data.tab.create')}
            onButtonClick={onCreateDataset}
          />
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
