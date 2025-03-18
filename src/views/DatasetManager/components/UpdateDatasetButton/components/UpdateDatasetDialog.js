// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { React, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { SolutionsUtils } from '../../../../../utils';
import { DatasetCreationParameters } from '../../CreateDatasetButton/components/DatasetCreationParameters';
import { useUpdateDatasetDialog } from './UpdateDatasetDialogHook';

export const UpdateDatasetDialog = ({ open, dataset, closeDialog, selectedRunner }) => {
  const { t } = useTranslation();
  const { dataSourceRunTemplates, updateRunner, solutionData, parentDataset, formattedParametersValues } =
    useUpdateDatasetDialog(dataset, selectedRunner);

  const methods = useForm({
    mode: 'onChange',
  });
  const { isDirty, errors } = methods.formState;
  const isValid = Object.keys(errors ?? {}).length === 0;
  useEffect(() => {
    if (open) {
      const escapedSourceType = SolutionsUtils.escapeRunTemplateId(selectedRunner?.runTemplateId);
      methods.reset({ [escapedSourceType]: formattedParametersValues });
    }
  }, [open, methods, selectedRunner?.runTemplateId, formattedParametersValues]);

  const updateRunnerAndCloseDialog = useCallback(() => {
    const values = methods.getValues();
    const escapedSourceType = SolutionsUtils.escapeRunTemplateId(selectedRunner?.runTemplateId);
    const parametersValues = SolutionsUtils.forgeRunnerParameters(solutionData, values[escapedSourceType]);
    const runnerPatch = { runTemplateId: selectedRunner?.runTemplateId, parametersValues };
    updateRunner(selectedRunner.id, dataset.id, runnerPatch);
    closeDialog();
  }, [closeDialog, dataset.id, methods, selectedRunner?.id, selectedRunner?.runTemplateId, solutionData, updateRunner]);

  return (
    <FormProvider {...methods} key={`form-update-dataset-${dataset.id}`}>
      <Dialog data-cy="update-dataset-parameters-dialog" open={open} fullWidth>
        <DialogTitle>{t('commoncomponents.datasetmanager.dialogs.update.title', 'Update dataset')}</DialogTitle>
        <DialogContent>
          <Typography sx={{ pb: 1 }}>
            {t('commoncomponents.datasetmanager.dialogs.update.subTitle', "Update your data source's information")}
          </Typography>
          <DatasetCreationParameters
            dataSourceRunTemplates={dataSourceRunTemplates}
            parentDataset={parentDataset}
            selectedRunner={selectedRunner}
          />
        </DialogContent>
        <DialogActions>
          <Button data-cy="close-update-dataset-parameters-dialog-button" onClick={closeDialog}>
            {t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel')}
          </Button>
          <Button
            data-cy="update-dataset-parameters-button"
            variant="contained"
            disabled={!isDirty || !isValid}
            onClick={updateRunnerAndCloseDialog}
          >
            {t('commoncomponents.datasetmanager.dialogs.update.button', 'Update')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};
UpdateDatasetDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  dataset: PropTypes.object.isRequired,
  selectedRunner: PropTypes.object,
};
