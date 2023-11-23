// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  DeleteForever as DeleteForeverIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { DontAskAgainDialog, SearchBar } from '@cosmotech/ui';
import { ResourceUtils } from '@cosmotech/core';
import { useDatasetList } from './DatasetListHook';
import { TwoActionsDialogService } from '../../../../services/twoActionsDialog/twoActionsDialogService';
import { CreateDatasetButton } from '../CreateDatasetButton';
import { TWINGRAPH_STATUS } from '../../../../services/config/ApiConstants';

const useStyles = makeStyles(() => ({
  searchBar: {
    width: '100%',
  },
}));

export const DatasetList = () => {
  const { t } = useTranslation();
  const classes = useStyles();
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

  const [isRefreshConfirmationDialogOpen, setIsRefreshConfirmationDialogOpen] = useState(false);
  const { datasets, currentDataset, selectDataset, deleteDataset, refreshDatasetById } = useDatasetList();

  const sortedDatasetList = useMemo(() => {
    return ResourceUtils.getResourceTree(datasets?.filter((dataset) => dataset.main === true));
  }, [datasets]);

  const [displayedDatasetList, setDisplayedDatasetList] = useState(sortedDatasetList);
  const datasetToRefresh = useRef('');

  useEffect(() => {
    setDisplayedDatasetList(sortedDatasetList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDatasetList]);

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

  const refreshDataset = useCallback(
    (event, datasetId) => {
      event.stopPropagation();
      if (localStorage.getItem('dontAskAgainToRefreshDataset') !== 'true') {
        datasetToRefresh.current = datasetId;
        setIsRefreshConfirmationDialogOpen(true);
      } else {
        refreshDatasetById(datasetId);
      }
    },
    [refreshDatasetById]
  );

  const confirmRefreshDataset = useCallback(
    (isChecked) => {
      localStorage.setItem('dontAskAgainToRefreshDataset', isChecked);
      refreshDatasetById(datasetToRefresh.current);
      setIsRefreshConfirmationDialogOpen(false);
    },
    [setIsRefreshConfirmationDialogOpen, refreshDatasetById, datasetToRefresh]
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
                    {!['None', 'File'].includes(dataset.sourceType) && (
                      <IconButton onClick={(event) => refreshDataset(event, dataset.id)}>
                        <RefreshIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={(event) => askConfirmationToDeleteDialog(event, dataset)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                }
                disableGutters
                sx={{ pl: dataset.depth * 2 }}
              >
                <ListItemText
                  primary={dataset.name}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary={
                    dataset.status === TWINGRAPH_STATUS.PENDING ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : dataset.status === TWINGRAPH_STATUS.ERROR ? (
                      <ErrorIcon color="error" />
                    ) : null
                  }
                  sx={{ display: 'flex', gap: 1 }}
                />
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
