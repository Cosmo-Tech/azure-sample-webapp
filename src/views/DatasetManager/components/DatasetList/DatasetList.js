// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { DeleteForever as DeleteForeverIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { DontAskAgainDialog, SearchBar } from '@cosmotech/ui';
import { useDatasetList } from './DatasetListHook';
import { TwoActionsDialogService } from '../../../../services/twoActionsDialog/twoActionsDialogService';
import { CreateDatasetButton } from '../CreateDatasetButton';

const useStyles = makeStyles(() => ({
  searchBar: {
    width: '100%',
  },
}));

export const DatasetList = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isRefreshConfirmationDialogOpen, setIsRefreshConfirmationDialogOpen] = useState(false);
  const { sortedDatasetList, currentDataset, selectDataset, deleteDataset } = useDatasetList();
  const [displayedDatasetList, setDisplayedDatasetList] = useState(sortedDatasetList);

  useEffect(() => {
    setDisplayedDatasetList(sortedDatasetList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDatasetList?.length]);

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
    async (event, dataset) => {
      event.stopPropagation();
      const dialogProps = {
        id: 'delete-dataset',
        component: 'div',
        labels: {
          title: t('commoncomponents.datasetmanager.dialogs.delete.title', 'Delete dataset?'),
          body: (
            <Trans
              i18nKey="commoncomponents.datasetmanager.dialogs.delete.body"
              defaultValue="Do you really want to delete <i>{{datasetName}}</i>?
                This action is irreversible."
              values={{ datasetName: dataset?.name }}
            />
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
        deleteDataset(dataset?.id);
      }
    },
    [t, deleteDataset]
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
      <Typography variant="h6">Datasets</Typography>
      <CreateDatasetButton />
    </Box>
  );

  return (
    <div>
      <SearchBar
        label={t('commoncomponents.datasetmanager.searchBar.label', 'Find...')}
        onSearchChange={filterDatasets}
        icon={<SearchIcon />}
        className={classes.searchBar}
      />
      <Card variant="outlined" square={true} sx={{ backgroundColor: 'transparent', mt: 1 }}>
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
                    <IconButton onClick={(event) => askConfirmationToDeleteDialog(event, dataset)}>
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
      </Card>
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
