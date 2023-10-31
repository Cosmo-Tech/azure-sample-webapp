// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { DeleteForever as DeleteForeverIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { DontAskAgainDialog, SearchBar } from '@cosmotech/ui';
import { DatasetsUtils } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import { useDatasetList } from './DatasetListHook';
import { TwoActionsDialogService } from '../../../../services/twoActionsDialog/twoActionsDialogService';
import { CreateDatasetButton } from '../CreateDatasetButton';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  searchBar: {
    width: '100%',
  },
}));

export const DatasetList = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isRefreshConfirmationDialogOpen, setIsRefreshConfirmationDialogOpen] = useState(false);
  const { sortedDatasetList, currentDataset, selectDataset } = useDatasetList();
  const [displayedDatasetList, setDisplayedDatasetList] = useState(sortedDatasetList);

  const filterDatasets = useCallback(
    (searchString) => {
      if (!searchString) {
        setDisplayedDatasetList(sortedDatasetList);
      } else {
        const datasets = sortedDatasetList.filter(
          (dataset) =>
            dataset.name.toLowerCase().includes(searchString.toLowerCase()) ||
            dataset.tags?.some((tag) => tag.toLowerCase().includes(searchString.toLowerCase()))
        );
        setDisplayedDatasetList(datasets);
      }
    },
    [sortedDatasetList]
  );

  const refreshDialogLabels = {
    title: t('commoncomponents.datasetmanager.dialogs.refresh.title', 'Overwrite data?'),
    body: t(
      'commoncomponents.datasetmanager.dialogs.refresh.body',
      'Your data will be lost, replaced with the imported one.'
    ),
    cancel: t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel'),
    confirm: t('commoncomponents.datasetmanager.dialogs.refresh.overwriteButton', 'Overwrite'),
    checkbox: t('commoncomponents.datasetmanager.dialogs.refresh.checkbox', 'Do not ask me again'),
  };
  const askConfirmationToDeleteDialog = useCallback(
    async (event, datasetId) => {
      event.stopPropagation();
      const initialDatasetName = sortedDatasetList.find((dataset) => dataset.id === datasetId)?.name;
      const childrenToDelete = DatasetsUtils.getAllChildrenDatasetsNames(datasetId, sortedDatasetList);
      const dialogProps = {
        id: 'delete-dataset',
        component: 'div',
        labels: {
          title: t('commoncomponents.datasetmanager.dialogs.delete.title', 'Delete dataset'),
          body: (
            <>
              {t(
                'commoncomponents.datasetmanager.dialogs.delete.body',
                'Do you really want to delete {{datasetName}}? This action is irreversible.',
                { datasetName: initialDatasetName }
              )}
              <p>
                {childrenToDelete.length > 0 &&
                  t(
                    'commoncomponents.datasetmanager.dialogs.delete.bodyWithChildren',
                    'The following children datasets will also be permanently removed:'
                  )}
              </p>
              <List>
                {childrenToDelete.map((dataset) => (
                  <ListItem
                    key={dataset}
                    sx={{ display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside' }}
                    dense
                  >
                    {dataset}
                  </ListItem>
                ))}
              </List>
            </>
          ),
          button1: t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel'),
          button2: t('commoncomponents.datasetmanager.dialogs.delete.confirmButton', 'Delete'),
        },
        button2Props: {
          color: 'error',
        },
      };
      const result = await TwoActionsDialogService.openDialog(dialogProps);
      if (result === 2) {
        // TODO deleteDataset(datasetId);
      }
    },
    [t, sortedDatasetList]
  );

  const refreshDataset = useCallback((datasetId) => {
    if (localStorage.getItem('dontAskAgainToRefreshDataset') !== 'true') {
      setIsRefreshConfirmationDialogOpen(true);
    } else {
      // TODO refreshDatasetById(datasetId);
    }
  }, []);

  const confirmRefreshDataset = useCallback(
    (isChecked, datasetId) => {
      localStorage.setItem('dontAskAgainToRefreshDataset', isChecked);
      setIsRefreshConfirmationDialogOpen(false);
      // TODO refreshDatasetById(datasetId);
    },
    [setIsRefreshConfirmationDialogOpen]
  );

  const datasetListHeader = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
      <Typography variant="h6">Datasets</Typography>
      <CreateDatasetButton />
    </Box>
  );

  return (
    <div>
      <SearchBar label="Find..." onSearchChange={filterDatasets} icon={<SearchIcon />} className={classes.searchBar} />
      <List subheader={datasetListHeader}>
        <Divider />
        {displayedDatasetList.map((dataset) => (
          <ListItemButton
            key={dataset.id}
            selected={dataset.id === currentDataset?.id}
            onClick={(e) => selectDataset(dataset)}
          >
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton onClick={() => refreshDataset(dataset.id)}>
                    <RefreshIcon />
                  </IconButton>
                  <IconButton onClick={(event) => askConfirmationToDeleteDialog(event, dataset.id)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              }
              disableGutters
              sx={{ pl: dataset.depth * 2 }}
            >
              <ListItemText primary={dataset.name} primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
          </ListItemButton>
        ))}
      </List>
      <DontAskAgainDialog
        id="refresh-dataset-dialog"
        open={isRefreshConfirmationDialogOpen}
        labels={refreshDialogLabels}
        onClose={() => setIsRefreshConfirmationDialogOpen(false)}
        onConfirm={(isChecked) => confirmRefreshDataset(isChecked)}
      />
    </div>
  );
};
