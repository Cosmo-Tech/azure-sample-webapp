// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { BasicTextInput } from '@cosmotech/ui';
import { DatasetCreationParameters } from '../DatasetCreationParameters';

export const DatasetWizard = ({ open, closeDialog, onConfirm, dataSourceRunTemplates, parentDataset }) => {
  const { t } = useTranslation();
  const methods = useForm({ mode: 'onChange' });
  const { formState } = methods;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) {
      methods.reset();
      setActiveStep(0);
    }
  }, [open, methods, setActiveStep]);

  const confirm = (event) => {
    const values = methods.getValues();
    onConfirm(values);
  };

  const isSubDatasetCreationWizard = useMemo(() => parentDataset != null, [parentDataset]);
  const optionalSubTitle = useMemo(() => {
    if (!isSubDatasetCreationWizard) return null;

    return (
      <Grid item xs={12}>
        <Typography sx={{ pb: 0.5, pt: 0, pl: 2 }} data-cy="wizard-subtitle-parent-dataset-name">
          {t(
            'commoncomponents.datasetmanager.wizard.firstScreen.subtitle.parentDataset',
            'Parent dataset: {{parentDatasetName}}',
            { parentDatasetName: parentDataset.name ?? 'N/A' }
          )}
        </Typography>
      </Grid>
    );
  }, [t, parentDataset, isSubDatasetCreationWizard]);

  const defaultName = useMemo(() => {
    if (!isSubDatasetCreationWizard) return '';
    return `${parentDataset?.name} (subdataset)`;
  }, [parentDataset?.name, isSubDatasetCreationWizard]);

  const firstStep = (
    <>
      <Grid item xs={12}>
        <Typography sx={{ pt: 2, pb: 1 }}>
          {t(
            'commoncomponents.datasetmanager.wizard.firstScreen.title',
            'Please provide some metadata regarding your new dataset'
          )}
        </Typography>
      </Grid>
      {optionalSubTitle}
      <Grid item xs={12}>
        <Controller
          name="name"
          defaultValue={defaultName}
          rules={{ required: true }}
          render={({ field }) => {
            const { value: titleValue, onChange: setTitleValue } = field;
            return (
              <BasicTextInput
                id="new-dataset-title"
                label={t('commoncomponents.datasetmanager.wizard.firstScreen.name', 'Name')}
                value={titleValue ?? ''}
                changeTextField={(newValue) => setTitleValue(newValue)}
                size="medium"
              ></BasicTextInput>
            );
          }}
        />
      </Grid>
      <Grid item xs={12} data-cy="new-dataset-tags-container">
        <Controller
          name="tags"
          defaultValue={parentDataset?.tags}
          render={({ field }) => {
            const { value: tagsValue, onChange: setTagsValue } = field;
            return (
              <Autocomplete
                id="new-dataset-tags"
                freeSolo
                multiple
                disableClearable
                options={[]}
                value={tagsValue ?? []}
                renderTags={(value, getTagProps) =>
                  value.map((tagText, index) => (
                    <Chip
                      key={index}
                      label={tagText}
                      data-cy={`new-dataset-tags-tag-${index}`}
                      color="primary"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label={t('commoncomponents.datasetmanager.wizard.firstScreen.tags', 'Tags')} />
                )}
                onChange={(event, values) => setTagsValue(values)}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          defaultValue={parentDataset?.description}
          render={({ field }) => {
            const { value: descriptionValue, onChange: setDescriptionValue } = field;
            return (
              <BasicTextInput
                id="new-dataset-description"
                label={t('commoncomponents.datasetmanager.wizard.firstScreen.description', 'Description')}
                value={descriptionValue ?? ''}
                changeTextField={(newValue) => setDescriptionValue(newValue)}
                size="medium"
                textFieldProps={{
                  multiline: true,
                  rows: 3,
                }}
              ></BasicTextInput>
            );
          }}
        />
      </Grid>
    </>
  );

  const dialogTitle = useMemo(
    () =>
      isSubDatasetCreationWizard
        ? t('commoncomponents.datasetmanager.wizard.subDatasetCreationTitle', 'Create sub dataset')
        : t('commoncomponents.datasetmanager.wizard.title', 'Create dataset'),
    [t, isSubDatasetCreationWizard]
  );

  const stepper = useMemo(() => {
    const stepTwoLabel = isSubDatasetCreationWizard
      ? t('commoncomponents.datasetmanager.wizard.subdatasetStepTwo', 'Dataset type')
      : t('commoncomponents.datasetmanager.wizard.stepTwo', 'Filter');

    return (
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepOne', 'Metadata')}</StepLabel>
        </Step>
        <Step>
          <StepLabel>{stepTwoLabel}</StepLabel>
        </Step>
      </Stepper>
    );
  }, [t, activeStep, isSubDatasetCreationWizard]);

  return (
    <FormProvider {...methods}>
      <Dialog open={open} fullWidth data-cy="dataset-creation-dialog">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container gap={1}>
            <Grid item xs={12}>
              {stepper}
            </Grid>
            {activeStep === 0 && firstStep}
            {activeStep === 1 && (
              <DatasetCreationParameters
                dataSourceRunTemplates={dataSourceRunTemplates}
                parentDataset={parentDataset}
              />
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} data-cy="cancel-dataset-creation">
            {t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel')}
          </Button>
          {activeStep !== 0 && (
            <Button
              data-cy="dataset-creation-previous-step"
              onClick={() => {
                setActiveStep(activeStep - 1);
              }}
            >
              {t('commoncomponents.datasetmanager.wizard.buttons.previous', 'Previous')}
            </Button>
          )}
          {activeStep !== 1 && (
            <Button
              data-cy="dataset-creation-next-step"
              variant="contained"
              disabled={!formState.isValid}
              onClick={() => {
                setActiveStep(activeStep + 1);
              }}
            >
              {t('commoncomponents.datasetmanager.wizard.buttons.next', 'Next')}
            </Button>
          )}
          {activeStep === 1 && (
            <Button
              variant="contained"
              disabled={!formState.isValid}
              onClick={confirm}
              data-cy="confirm-dataset-creation"
            >
              {t('commoncomponents.datasetmanager.wizard.buttons.create', 'Create')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

DatasetWizard.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  dataSourceRunTemplates: PropTypes.object.isRequired,
  parentDataset: PropTypes.object,
};
