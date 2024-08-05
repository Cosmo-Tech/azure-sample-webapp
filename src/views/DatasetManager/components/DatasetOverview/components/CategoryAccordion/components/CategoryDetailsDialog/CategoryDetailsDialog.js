// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Typography, Dialog, DialogTitle, Box, Card, CardContent, Button, DialogContent } from '@mui/material';
import { GenericTable } from '../../../../../../../../components/';
import { TranslationUtils } from '../../../../../../../../utils';
import { KPIValue } from '../../../KPIValue';
import { useCategoryDetailsDialogHook } from './CategoryDetailsDialogHook';

export const CategoryDetailsDialog = (props) => {
  const { datasetName, datasetId } = useCategoryDetailsDialogHook();
  const { t } = useTranslation();

  const { kpis, category } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const categories = useMemo(() => {
    return (
      <Grid container sx={{ p: 5 }} justifyContent="space-evenly" spacing={2}>
        {category.kpis.map((kpi) => {
          return (
            <Grid item key={`${kpi.id}-key`}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5">
                    {t(TranslationUtils.getDatasetCategoryKpiNameTranslationKey(category.id, kpi.id), kpi.id)}
                  </Typography>
                  <Grid item sx={{ mt: 3 }}>
                    <KPIValue
                      kpi={kpis.find((kpiResult) => kpiResult.id === kpi.id)}
                      valueTypographyProps={{ variant: 'subtitle2', sx: { opacity: '70%' } }}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }, [category.id, category.kpis, kpis, t]);

  const context = {
    isDarkTheme: true,
    editMode: false,
    targetDatasetId: datasetId,
  };

  const parameterData = {
    options: {
      columns: [],
      dynamicValues: {
        query: '',
        resultKey: 'fields',
      },
    },
  };

  return (
    <>
      <Button data-cy="category-details-open-button" variant="outlined" onClick={handleOpen}>
        Details
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'xl'}
        PaperProps={{
          style: {
            minHeight: '90%',
            maxHeight: '90%',
          },
        }}
      >
        <DialogTitle>
          <Button onClick={handleClose}>{t('commoncomponents.dialog.share.dialog.buttons.close', 'Close')}</Button>
          <Box sx={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
            <Box>
              <Typography variant="h4">{datasetName}</Typography>
              <Typography variant="h5" sx={{ opacity: '70%' }}>
                {t(TranslationUtils.getDatasetCategoryNameTranslationKey(category.id), category.id ?? 'category')}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {categories}
          <GenericTable
            parameterData={parameterData}
            context={context}
            parameterValue={null}
            setParameterValue={() => {}}
            resetParameterValue={() => {}}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

CategoryDetailsDialog.propTypes = {
  category: PropTypes.object.isRequired,
  kpis: PropTypes.array,
};

CategoryDetailsDialog.defaultProps = {};
