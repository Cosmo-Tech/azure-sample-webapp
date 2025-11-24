// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { UploadFile, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { useFileParameters } from '../../../../hooks/FileParameterHooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { FileManagementUtils } from '../../../../utils/FileManagementUtils';
import { getFileName } from '../../../../utils/scenarioParameters/FileParameterUtils';

export const GenericUploadFile = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  defaultParameterValue,
  resetParameterValue,
  error,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { downloadDatasetPartFile } = useFileParameters();

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
    if (shouldReset) resetParameterValue(defaultParameterValue);
    else updateParameterValue({ status: newFileStatus });
  };

  const labels = {
    button: t('genericcomponent.uploadfile.button.browse'),
    invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
    label: t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId),
    delete: t('genericcomponent.uploadfile.tooltip.delete'),
    noFileMessage: t('genericcomponent.uploadfile.noFileMessage', 'None'),
    getFileNamePlaceholder: (fileExtension) =>
      t('genericcomponent.uploadfile.fileNamePlaceholder', '{{fileExtension}} file', { fileExtension }),
  };

  return (
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
    />
  );
};

GenericUploadFile.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  defaultParameterValue: PropTypes.any,
  resetParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};

GenericUploadFile.useValidationRules = () => {
  const { t } = useTranslation();
  return {
    validate: {
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
