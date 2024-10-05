// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid2 as Grid, Typography, Dialog, DialogTitle, Box, Button, DialogContent } from '@mui/material';
import { TABLE_DATA_STATUS } from '@cosmotech/ui';
import { GenericTable } from '../../../../../../../../components/';
import { TranslationUtils } from '../../../../../../../../utils';
import GraphIndicator from '../../../GraphIndicator';
import { useCategoryDetailsDialogHook } from './CategoryDetailsDialogHook';

export const CategoryDetailsDialog = (props) => {
  const { kpis = [], category } = props;

  const { datasetName, datasetId, getQuery, isDarkTheme } = useCategoryDetailsDialogHook();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const categoryKpis = useMemo(() => {
    return (
      <Grid
        container
        spacing={8}
        sx={{
          justifyContent: 'center',
          p: 5,
        }}
      >
        {(category?.kpis ?? []).map((kpiMetadata) => {
          const kpi = kpis.find((kpiResult) => kpiResult.id === kpiMetadata.id) ?? kpiMetadata;
          return (
            <Grid key={`${kpi.id}-key`}>
              <GraphIndicator categoryId={category.id} id={kpi.id} kpi={kpi} />
            </Grid>
          );
        })}
      </Grid>
    );
  }, [category.id, category?.kpis, kpis]);

  const detailsTable = useMemo(() => {
    const query = getQuery(category?.previewTable?.queryId)?.query;
    if (query == null) return null;

    const parameterData = {
      id: category?.id,
      options: {
        columns: category?.previewTable?.columns,
        dynamicValues: { query, resultKey: category?.previewTable?.resultKey },
      },
    };
    const tableOptions = {
      buttons: {
        label: false,
        import: false,
        addRow: false,
        deleteRow: false,
        revert: false,
      },
      height: '100%',
    };

    return (
      <GenericTable
        parameterData={parameterData}
        context={{ isDarkTheme, editMode: false, targetDatasetId: datasetId, tableOptions }}
        parameterValue={{ status: TABLE_DATA_STATUS.EMPTY }}
        setParameterValue={() => {}}
        resetParameterValue={() => {}}
        isDirty={null}
      />
    );
  }, [
    category?.previewTable?.queryId,
    getQuery,
    isDarkTheme,
    datasetId,
    category?.id,
    category?.previewTable?.columns,
    category?.previewTable?.resultKey,
  ]);

  return (
    detailsTable && (
      <>
        <Button data-cy="category-details-dialog-open-button" variant="outlined" onClick={handleOpen}>
          {t('commoncomponents.dialog.share.dialog.buttons.open', 'Open')}
        </Button>
        <Dialog
          data-cy="category-details-dialog"
          disableEnforceFocus
          fullScreen
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={'xl'}
          PaperProps={{
            elevation: 1,
          }}
        >
          <DialogTitle>
            <Button data-cy="category-details-dialog-close-button" onClick={handleClose}>
              {t('commoncomponents.dialog.share.dialog.buttons.close', 'Close')}
            </Button>
            <Box sx={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
              <Box>
                <Typography data-cy="category-details-dialog-dataset-name" variant="h4">
                  {datasetName}
                </Typography>
                <Typography data-cy="category-details-dialog-category-name" variant="h5" sx={{ opacity: '70%' }}>
                  {t(TranslationUtils.getDatasetCategoryNameTranslationKey(category.id), category.id ?? 'category')}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <div style={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
              {categoryKpis}
              <div style={{ flex: '1', minHeight: '200px', overflow: 'auto' }}>{detailsTable}</div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

CategoryDetailsDialog.propTypes = {
  category: PropTypes.object.isRequired,
  kpis: PropTypes.array,
};
