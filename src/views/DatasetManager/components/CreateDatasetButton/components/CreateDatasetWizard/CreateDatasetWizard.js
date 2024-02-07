// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Button,
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
import { BasicEnumInput, BasicTextInput, UploadFile } from '@cosmotech/ui';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { DatasetsUtils } from '../../../../../../utils';
import { FileManagementUtils } from '../../../../../../utils/FileManagementUtils';
import { useTranslation } from 'react-i18next';
import { useCreateDataset } from '../../../../../../state/hooks/DatasetHooks';
import { DATASET_SOURCE_TYPE } from '../../../../../../services/config/ApiConstants';

export const CreateDatasetWizard = ({ open, closeDialog }) => {
  const { t } = useTranslation();
  const createDataset = useCreateDataset();

  // TODO confirm real keys for sourceType
  const datasetSourceTypeEnumValues = [
    {
      key: DATASET_SOURCE_TYPE.AZURE_STORAGE,
      value: t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.azureStorage', 'Azure Storage'),
    },
    {
      key: DATASET_SOURCE_TYPE.LOCAL_FILE,
      value: t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.local', 'Local file'),
    },
    {
      key: DATASET_SOURCE_TYPE.ADT,
      value: t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.adt', 'Azure Digital Twin'),
    },
    {
      key: DATASET_SOURCE_TYPE.NONE,
      value: t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.none', 'Empty'),
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [datasetSourceType, setDatasetSourceType] = useState(datasetSourceTypeEnumValues[0].key);

  const methods = useForm({ mode: 'onChange' });
  const { formState } = methods;

  useEffect(() => {
    if (open) {
      methods.reset();
      setActiveStep(0);
      setDatasetSourceType(datasetSourceTypeEnumValues[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const createDatasetAndCloseDialog = useCallback(() => {
    const values = methods.getValues();
    DatasetsUtils.removeUndefinedValuesBeforeCreatingDataset(values);
    if ([DATASET_SOURCE_TYPE.LOCAL_FILE, DATASET_SOURCE_TYPE.NONE].includes(values.sourceType)) values.source = null;
    createDataset(values);
    closeDialog();
  }, [closeDialog, methods, createDataset]);

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
          name="name"
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
          name="description"
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
          {t('commoncomponents.datasetmanager.wizard.secondScreen.subtitle', 'Please provide your data source')}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="sourceType"
          defaultValue={datasetSourceType}
          shouldUnregister={true}
          render={({ field }) => {
            const { value: datasetSourceTypeValue, onChange: setDatasetSourceTypeValue } = field;
            const setDatasetSource = (newValue) => {
              setDatasetSourceTypeValue(newValue);
              setDatasetSourceType(newValue);
            };
            return (
              <BasicEnumInput
                id="new-dataset-sourceType"
                label={t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.label', 'Source')}
                size="medium"
                value={datasetSourceTypeValue ?? datasetSourceTypeEnumValues[0].key}
                changeEnumField={(newValue) => setDatasetSource(newValue)}
                enumValues={datasetSourceTypeEnumValues}
              />
            );
          }}
        />
      </Grid>
      {datasetSourceType === DATASET_SOURCE_TYPE.LOCAL_FILE && (
        <Grid item xs={12} sx={{ pt: 4 }}>
          <Controller
            name="file"
            rules={{ required: true }}
            render={({ field }) => {
              const { value: datasetLocalFile, onChange: setDatasetLocalFile } = field;
              return (
                <UploadFile
                  id="local-source-type"
                  handleDeleteFile={() => setDatasetLocalFile({})}
                  editMode={true}
                  handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, setDatasetLocalFile)}
                  file={datasetLocalFile ?? {}}
                  acceptedFileTypes="application/zip"
                />
              );
            }}
          />
        </Grid>
      )}
      {datasetSourceType === 'AzureStorage' && (
        <Grid container direction="column" gap={1} sx={{ px: 2, pt: 4 }}>
          <Controller
            name="source.name"
            rules={{ required: true }}
            render={({ field }) => {
              const { value: azureStorageAccountName, onChange: setAzureStorageAccountName } = field;
              return (
                <BasicTextInput
                  id="azure-storage-account-name"
                  label={t(
                    'commoncomponents.datasetmanager.wizard.secondScreen.azureStorage.accountName',
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
            name="source.location"
            rules={{ required: true }}
            render={({ field }) => {
              const { value: azureStorageContainerName, onChange: setAzureStorageContainerName } = field;
              return (
                <BasicTextInput
                  id="azure-storage-container-name"
                  label={t(
                    'commoncomponents.datasetmanager.wizard.secondScreen.azureStorage.containerName',
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
            name="source.path"
            rules={{ required: true }}
            render={({ field }) => {
              const { value: azureStoragePath, onChange: setAzureStoragePath } = field;
              return (
                <BasicTextInput
                  id="azure-storage-path"
                  label={t('commoncomponents.datasetmanager.wizard.secondScreen.azureStorage.path', 'Path')}
                  size="medium"
                  value={azureStoragePath ?? ''}
                  changeTextField={(newValue) => setAzureStoragePath(newValue)}
                />
              );
            }}
          />
        </Grid>
      )}
      {datasetSourceType === 'ADT' && (
        <Grid item xs={12} sx={{ pt: 4, px: 2 }}>
          <Controller
            name="source.location"
            rules={{ required: true }}
            render={({ field }) => {
              const { value: adtUrl, onChange: setAdtUrl } = field;
              return (
                <BasicTextInput
                  id="adt-url"
                  label="Url"
                  size="medium"
                  value={adtUrl ?? ''}
                  changeTextField={(newValue) => setAdtUrl(newValue)}
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
      <Dialog open={open} fullWidth data-cy="dataset-creation-dialog">
        <DialogTitle>{t('commoncomponents.datasetmanager.wizard.title', 'Create dataset')}</DialogTitle>
        <DialogContent>
          <Grid container gap={1}>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep}>
                <Step>
                  <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepOne', 'Metadata')}</StepLabel>
                </Step>
                <Step>
                  <StepLabel>{t('commoncomponents.datasetmanager.wizard.stepTwo', 'Dataset type')}</StepLabel>
                </Step>
              </Stepper>
            </Grid>
            {activeStep === 0 && firstStep}
            {activeStep === 1 && secondStep}
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
              onClick={createDatasetAndCloseDialog}
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

CreateDatasetWizard.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
