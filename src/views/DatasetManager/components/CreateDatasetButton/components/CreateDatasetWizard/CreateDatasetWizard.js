// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
  DialogActions,
  Button,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import { BasicEnumInput, BasicRadioInput, BasicTextInput, UploadFile } from '@cosmotech/ui';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { FileManagementUtils } from '../../../../../../utils';
import { useTranslation } from 'react-i18next';

export const CreateDatasetWizard = ({ open, closeDialog }) => {
  const { t } = useTranslation();

  const datasetLocationEnumValues = [
    { key: 'existingData', value: t('commoncomponents.datasetmanager.wizard.secondScreen.existingData', 'Yes') },
    {
      key: 'fromScratch',
      value: t(
        'commoncomponents.datasetmanager.wizard.secondScreen.fromScratch',
        'No, I want to create one from scratch'
      ),
    },
  ];

  // TODO confirm real keys for sourceType
  const datasetSourceTypeEnumValues = [
    {
      key: 'AzureStorage',
      value: t('commoncomponents.datasetmanager.wizard.thirdScreen.dataSourceType.azureStorage', 'Azure Storage'),
    },
    { key: 'local', value: t('commoncomponents.datasetmanager.wizard.thirdScreen.dataSourceType.local', 'Local file') },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [datasetLocation, setDatasetLocation] = useState('');
  const [datasetSourceType, setDatasetSourceType] = useState(datasetSourceTypeEnumValues[0].key);

  const methods = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (open) {
      methods.reset();
      setActiveStep(0);
      setDatasetLocation('');
      setDatasetSourceType(datasetSourceTypeEnumValues[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const createDataset = useCallback(() => {
    // TODO: implement useCreateDatasetHook
    closeDialog();
  }, [closeDialog]);

  const firstStep = (
    <>
      <Grid item xs={12}>
        <Typography sx={{ py: 2 }}>
          {t(
            'commoncomponents.datasetmanager.wizard.firstScreen.title',
            'Please provide some metadata regarding your new dataset'
          )}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="new-dataset-title"
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
      <Grid item xs={12}>
        <Controller
          name="new-dataset-tags"
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
                renderInput={(params) => (
                  <TextField {...params} label={t('commoncomponents.datasetmanager.wizard.firstScreen.tags', 'Tags')} />
                )}
                onChange={(event, values) => setTagsValue(values)}
                ChipProps={{ color: 'primary' }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="new-dataset-description"
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

  const secondStep = (
    <>
      <Grid item xs={12}>
        <Typography sx={{ py: 2 }}>
          {t('commoncomponents.datasetmanager.wizard.secondScreen.subtitle', 'Do you already have data to import?')}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <BasicRadioInput
          id="dataset-location"
          row={false}
          value={datasetLocation}
          changeRadioOption={setDatasetLocation}
          enumValues={datasetLocationEnumValues}
        />
      </Grid>
    </>
  );
  const thirdStep = (
    <>
      <Grid item xs={12}>
        <Typography sx={{ py: 2 }}>
          {t('commoncomponents.datasetmanager.wizard.thirdScreen.subtitle', 'Please provide your data source')}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="new-dataset-sourceType"
          render={({ field }) => {
            const { value: datasetSourceTypeValue, onChange: setDatasetSourceTypeValue } = field;
            const setDatasetSource = (newValue) => {
              setDatasetSourceTypeValue(newValue);
              setDatasetSourceType(newValue);
            };
            return (
              <BasicEnumInput
                id="new-dataset-sourceType"
                label={t('commoncomponents.datasetmanager.wizard.thirdScreen.dataSourceType.label', 'Source')}
                size="medium"
                value={datasetSourceTypeValue ?? datasetSourceTypeEnumValues[0].key}
                changeEnumField={(newValue) => setDatasetSource(newValue)}
                enumValues={datasetSourceTypeEnumValues}
              />
            );
          }}
        />
      </Grid>
      {datasetSourceType === 'local' && (
        <Grid item xs={12} sx={{ pt: 4 }}>
          <Controller
            name="new-dataset-file"
            render={({ field }) => {
              const { value: datasetLocalFile, onChange: setDatasetLocalFile } = field;
              return (
                <UploadFile
                  id="local-source-type"
                  handleDeleteFile={() => setDatasetLocalFile({})}
                  editMode={true}
                  handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, setDatasetLocalFile)}
                  file={datasetLocalFile ?? {}}
                />
              );
            }}
          />
        </Grid>
      )}
      {datasetSourceType === 'AzureStorage' && (
        <Grid container direction="column" gap={1} sx={{ px: 2 }}>
          <Controller
            name="azure-storage-account-name"
            render={({ field }) => {
              const { value: azureStorageAccountName, onChange: setAzureStorageAccountName } = field;
              return (
                <BasicTextInput
                  id="azure-storage-account-name"
                  label={t(
                    'commoncomponents.datasetmanager.wizard.thirdScreen.azureStorage.accountName',
                    'Account name'
                  )}
                  size="medium"
                  value={azureStorageAccountName ?? ''}
                  changeTextField={(newValue) => setAzureStorageAccountName(newValue)}
                />
              );
            }}
          />
          <Controller
            name="azure-storage-container-name"
            render={({ field }) => {
              const { value: azureStorageContainerName, onChange: setAzureStorageContainerName } = field;
              return (
                <BasicTextInput
                  id="azure-storage-container-name"
                  label={t(
                    'commoncomponents.datasetmanager.wizard.thirdScreen.azureStorage.containerName',
                    'Container name'
                  )}
                  size="medium"
                  value={azureStorageContainerName ?? ''}
                  changeTextField={(newValue) => setAzureStorageContainerName(newValue)}
                />
              );
            }}
          />
          <Controller
            name="azure-storage-path"
            render={({ field }) => {
              const { value: azureStoragePath, onChange: setAzureStoragePath } = field;
              return (
                <BasicTextInput
                  id="azure-storage-path"
                  label={t('commoncomponents.datasetmanager.wizard.thirdScreen.azureStorage.path', 'Path')}
                  size="medium"
                  value={azureStoragePath ?? ''}
                  changeTextField={(newValue) => setAzureStoragePath(newValue)}
                />
              );
            }}
          />
        </Grid>
      )}
    </>
  );

  return (
    <FormProvider {...methods}>
      <Dialog open={open} fullWidth>
        <DialogTitle>{t('commoncomponents.datasetmanager.wizard.title', 'Create dataset')}</DialogTitle>
        <DialogContent>
          <Grid container gap={1}>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepOne', 'Metadata')}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepTwo', 'Data source')}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepThree', 'Dataset type')}</StepLabel>
                </Step>
              </Stepper>
            </Grid>
            {activeStep === 0 && firstStep}
            {activeStep === 1 && secondStep}
            {activeStep === 2 && thirdStep}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel')}</Button>
          {activeStep !== 0 && (
            <Button
              onClick={() => {
                setActiveStep(activeStep - 1);
              }}
            >
              {t('commoncomponents.datasetmanager.wizard.buttons.previous', 'Previous')}
            </Button>
          )}
          {activeStep !== 2 && datasetLocation !== 'fromScratch' && (
            <Button
              variant="contained"
              disabled={datasetLocation === '' && activeStep === 1}
              onClick={() => {
                setActiveStep(activeStep + 1);
              }}
            >
              {t('commoncomponents.datasetmanager.wizard.buttons.next', 'Next')}
            </Button>
          )}
          {(activeStep === 2 || datasetLocation === 'fromScratch') && (
            <Button variant="contained" onClick={createDataset}>
              {t('commoncomponents.datasetmanager.wizard.buttons.create', 'Create')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

CreateDatasetWizard.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
