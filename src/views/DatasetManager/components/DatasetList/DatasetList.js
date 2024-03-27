// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, Error as ErrorIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ResourceUtils } from '@cosmotech/core';
import { PermissionsGate, SearchBar } from '@cosmotech/ui';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { CreateDatasetButton } from '../CreateDatasetButton';
import { DeleteDatasetButton } from '../DeleteDatasetButton/DeleteDatasetButton';
import { useDatasetList } from './DatasetListHook';

const useStyles = makeStyles(() => ({
  searchBar: {
    width: '100%',
    marginTop: '8px',
  },
}));

export const DatasetList = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { userPermissionsInCurrentOrganization, datasets, currentDataset, selectDataset } = useDatasetList();

  const sortedDatasetList = useMemo(() => {
    return ResourceUtils.sortResourceListByName(datasets);
  }, [datasets]);

  const [displayedDatasetList, setDisplayedDatasetList] = useState(sortedDatasetList);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    setDisplayedDatasetList(sortedDatasetList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedDatasetList]);

  const filterDatasets = useCallback(
    (searchString) => {
      const datasetsToDisplay = !searchString
        ? sortedDatasetList
        : sortedDatasetList.filter(
            (dataset) =>
              dataset.name.toLowerCase().includes(searchString.toLowerCase()) ||
              dataset.tags?.some((tag) => tag.toLowerCase().includes(searchString.toLowerCase()))
          );
      setDisplayedDatasetList(datasetsToDisplay);
    },
    [sortedDatasetList]
  );

  useEffect(() => {
    filterDatasets(searchString);
  }, [searchString, filterDatasets]);

  const datasetListHeader = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, height: '48px' }}>
      <Typography variant="h6">Datasets</Typography>
      <PermissionsGate
        userPermissions={userPermissionsInCurrentOrganization}
        necessaryPermissions={[ACL_PERMISSIONS.ORGANIZATION.CREATE_CHILDREN]}
      >
        <CreateDatasetButton />
      </PermissionsGate>
    </Box>
  );

  const getDatasetListItemActions = useCallback((dataset) => {
    const statusIcon =
      dataset.ingestionStatus === INGESTION_STATUS.PENDING ? (
        <CircularProgress data-cy={`refresh-spinner-${dataset.id}`} size="1rem" color="inherit" />
      ) : dataset.ingestionStatus === INGESTION_STATUS.ERROR ? (
        <ErrorIcon data-cy={`refresh-error-icon-${dataset.id}`} color="error" />
      ) : null;

    const ignoreClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Box onClick={ignoreClick} style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'inline-flex', padding: '8px', verticalAlign: 'middle' }}>{statusIcon}</div>
        <DeleteDatasetButton dataset={dataset} location="" />
      </Box>
    );
  }, []);

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', height: '100%' }}>
      <SearchBar
        label={t('commoncomponents.datasetmanager.searchBar.label', 'Find...')}
        onSearchChange={setSearchString}
        icon={<SearchIcon />}
        className={classes.searchBar}
        id="dataset-search-bar"
        size="small"
      />
      <Card variant="outlined" square={true} sx={{ backgroundColor: 'transparent', mt: 1, height: '100%' }}>
        <List subheader={datasetListHeader} data-cy="datasets-list" sx={{ height: 'calc(100% - 48px)' }}>
          <Divider />
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            {displayedDatasetList.map((dataset) => (
              <ListItemButton
                key={dataset.id}
                data-cy={`datasets-list-item-button-${dataset.id}`}
                selected={dataset.id === currentDataset?.id}
                onClick={(e) => selectDataset(dataset)}
              >
                <ListItem
                  secondaryAction={getDatasetListItemActions(dataset)}
                  disableGutters
                  sx={{ pl: dataset.depth * 2 }}
                >
                  <ListItemText
                    data-cy={`datasets-list-item-text-${dataset.id}`}
                    primary={dataset.name}
                    primaryTypographyProps={{ variant: 'body1', lineHeight: '22px' }}
                    sx={{ pr: '120px', my: '0px' }}
                  />
                </ListItem>
              </ListItemButton>
            ))}
          </Box>
        </List>
      </Card>
    </div>
  );
};
