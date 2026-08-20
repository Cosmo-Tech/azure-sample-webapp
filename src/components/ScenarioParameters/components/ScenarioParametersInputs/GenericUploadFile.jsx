// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { UploadFile, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { useFileParameters } from '../../../../hooks/FileParameterHooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { FileManagementUtils } from '../../../../utils/FileManagementUtils';
import { getFileName } from '../../../../utils/scenarioParameters/FileParameterUtils';
import {
  PARAMETER_CONTEXT_VIEWS,
  PARAMETER_CONTEXT_WIDTH,
} from '../../../../utils/scenarioParameters/ParameterContext';

const GRID_ITEM_PROPS_MAPPING = {
  [PARAMETER_CONTEXT_WIDTH.SMALL]: { size: 12, sx: { pt: 1 } },
  [PARAMETER_CONTEXT_WIDTH.LARGE]: { size: 3 },
};

export const GenericUploadFile = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  defaultParameterValue,
  resetParameterValue,
  setParameterValueError,
  error,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { downloadDatasetPartFile } = useFileParameters();
  const gridItemProps = GRID_ITEM_PROPS_MAPPING[context?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL];

  const parameterId = parameterData.id;
  const fileName = getFileName(parameterValue);
  const file = { name: fileName, status: parameterValue?.status ?? UPLOAD_FILE_STATUS_KEY.EMPTY };
  const defaultFileTypeFilter = ConfigUtils.getParameterAttribute(parameterData, 'defaultFileTypeFilter');
  const renameFileOnUpload = ConfigUtils.getParameterAttribute(parameterData, 'shouldRenameFileOnUpload');

  const updateParameterValue = (valuePatch) => setParameterValue({ ...parameterValue, ...valuePatch });

  const setFileParameterStatus = (newFileStatus) => {
    const shouldReset =
      newFileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE &&
      defaultParameterValue?.status === UPLOAD_FILE_STATUS_KEY.EMPTY;

    if (shouldReset) {
      resetParameterValue(defaultParameterValue);
      // Force an error in the input field because RHF does not trigger custom validation rules on reset
      const isDatasetManagerView = context?.view === PARAMETER_CONTEXT_VIEWS.DATASET_MANAGER;
      const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required');
      if (isRequired || isDatasetManagerView) {
        const message = t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required');
        setParameterValueError({ type: 'required', message });
      }
    } else updateParameterValue({ status: newFileStatus });
  };

  const labels = {
    button: t('genericcomponent.uploadfile.button.browse'),
    invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
    label: t(
      TranslationUtils.getParameterTranslationKey(parameterData.idForTranslationKey ?? parameterId),
      parameterId
    ),
    delete: t('genericcomponent.uploadfile.tooltip.delete'),
    noFileMessage: t('genericcomponent.uploadfile.noFileMessage', 'None'),
    getFileNamePlaceholder: (fileExtension) =>
      t('genericcomponent.uploadfile.fileNamePlaceholder', '{{fileExtension}} file', { fileExtension }),
  };
  const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required') ?? false;

  return (
    <Grid {...gridItemProps}>
      <UploadFile
        key={parameterId}
        id={parameterId}
        labels={labels}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        acceptedFileTypes={defaultFileTypeFilter}
        shouldHideFileName={renameFileOnUpload}
        handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, updateParameterValue, parameterData)}
        handleDeleteFile={() => setFileParameterStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE)}
        handleDownloadFile={(event) => {
          event.preventDefault();
          downloadDatasetPartFile(parameterValue, setFileParameterStatus);
        }}
        file={file}
        error={error}
        editMode={context.editMode}
        isDirty={isDirty}
        required={isRequired}
      />
    </Grid>
  );
};

GenericUploadFile.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  defaultParameterValue: PropTypes.any,
  resetParameterValue: PropTypes.func.isRequired,
  setParameterValueError: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};

GenericUploadFile.useValidationRules = (parameterData, isDatasetManagerView) => {
  const { t } = useTranslation();
  const requiredValueFromConfig = ConfigUtils.getParameterAttribute(parameterData, 'required');
  const isRequired = requiredValueFromConfig === true || (isDatasetManagerView && requiredValueFromConfig !== false);

  return {
    validate: {
      required: (parameterValue) => {
        if (
          isRequired &&
          (parameterValue?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE ||
            parameterValue?.status === UPLOAD_FILE_STATUS_KEY.EMPTY)
        )
          return t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required');
        return true;
      },
      fileFormat: (parameterValue) => {
        return (
          parameterValue?.value == null ||
          parameterValue?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE ||
          FileManagementUtils.isFileFormatValid(parameterValue.value.type) ||
          t('views.scenario.scenarioParametersValidationErrors.fileFormat', 'File format not supported')
        );
      },
    },
  };
};
