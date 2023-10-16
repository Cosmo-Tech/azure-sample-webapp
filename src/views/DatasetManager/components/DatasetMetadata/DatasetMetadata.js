// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid, IconButton, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { TagsEditor } from '@cosmotech/ui';
import { useDatasetMetadata } from './DatasetMetadataHook';
import { DescriptionEditor, MetadataItem } from './components';
import { ApiUtils } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    width: '16px',
    height: '16px',
  },
}));

const DatasetMetadata = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { dataset } = useDatasetMetadata();

  const apiUrl = useMemo(() => ApiUtils.getDatasetApiUrl(dataset?.id), [dataset?.id]);
  const tagsEditorLabels = useMemo(
    () => ({
      header: t('commoncomponents.datasetmanager.metadata.tags', 'Tags'),
      placeholder: t('commoncomponents.datasetmanager.metadata.tagsPlaceholder', 'Enter a new tag'),
    }),
    [t]
  );

  const copyApiUrlButton = useMemo(
    () => (
      <IconButton
        size="small"
        data-cy="dataset-metadata-copy-api-url-button"
        aria-label="copy dataset API URL"
        onClick={() => navigator.clipboard.writeText(apiUrl)}
      >
        <FileCopyOutlinedIcon className={classes.copyIcon} />
      </IconButton>
    ),
    [apiUrl, classes.copyIcon]
  );

  return (
    <Card component={Paper} sx={{ p: 1 }} data-cy="dataset-metadata-card">
      <Grid
        container
        spacing={1}
        sx={{ flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flexWrap: 'nowrap' }}
      >
        {/* TODO: replace ownerId by owernName when available */}
        <MetadataItem
          id="author"
          label={t('commoncomponents.datasetmanager.metadata.author', 'Author')}
          value={dataset?.ownerId}
        ></MetadataItem>
        <MetadataItem
          id="creation-date"
          label={t('commoncomponents.datasetmanager.metadata.creationDate', 'Creation date')}
          value={dataset?.creationDate && new Date(dataset?.creationDate).toLocaleString()}
        ></MetadataItem>
        <MetadataItem
          id="refresh-date"
          label={t('commoncomponents.datasetmanager.metadata.refreshDate', 'Last refresh')}
          value={dataset?.refreshDate && new Date(dataset?.refreshDate).toLocaleString()}
        ></MetadataItem>
        <MetadataItem
          id="source-type"
          label={t('commoncomponents.datasetmanager.metadata.sourceType', 'Source')}
          value={dataset?.sourceType}
        ></MetadataItem>
        <MetadataItem
          id="api-url"
          label={t('commoncomponents.datasetmanager.metadata.apiUrl', 'API URL')}
          value={`datasets/${dataset?.id}`}
          action={copyApiUrlButton}
        ></MetadataItem>

        <Grid item>
          <TagsEditor
            id="dataset-tags"
            labels={tagsEditorLabels}
            values={dataset?.tags}
            readOnly={false}
            onChange={(newTags) => {
              // TODO: add saga & call back-end to update dataset tags
            }}
          />
        </Grid>
        <DescriptionEditor
          value={dataset?.description}
          readOnly={false}
          onChange={(newDescription) => {
            // TODO: add saga & call back-end to update dataset description
          }}
        ></DescriptionEditor>
      </Grid>
    </Card>
  );
};

export default DatasetMetadata;
