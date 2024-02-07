// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { UploadFile, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { FileManagementUtils } from '../../../../utils/FileManagementUtils';

export const GenericUploadFile = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  defaultParameterValue,
  resetParameterValue,
  error,
  isDirty,
}) => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const parameterId = parameterData.id;
  const parameter = parameterValue || {};
  const datasetId = parameter.id;
  const defaultFileTypeFilter = ConfigUtils.getParameterAttribute(parameterData, 'defaultFileTypeFilter');
  const renameFileOnUpload = ConfigUtils.getParameterAttribute(parameterData, 'shouldRenameFileOnUpload');

  function updateParameterValue(newValuePart) {
    setParameterValue({
      ...parameterValue,
      ...newValuePart,
    });
  }

  function setClientFileDescriptorStatus(newFileStatus) {
    const shouldReset =
      newFileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE &&
      defaultParameterValue?.status === UPLOAD_FILE_STATUS_KEY.EMPTY;
    if (shouldReset) {
      resetParameterValue(defaultParameterValue);
    } else {
      updateParameterValue({
        status: newFileStatus,
      });
    }
  }

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
      handleDeleteFile={() => FileManagementUtils.prepareToDeleteFile(setClientFileDescriptorStatus)}
      handleDownloadFile={(event) => {
        event.preventDefault();
        FileManagementUtils.downloadFile(organizationId, workspaceId, datasetId, setClientFileDescriptorStatus);
      }}
      file={parameter}
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
GenericUploadFile.defaultProps = {
  isDirty: false,
};
GenericUploadFile.useValidationRules = () => {
  const { t } = useTranslation();
  return {
    validate: {
      fileFormat: (value) => {
        return (
          value?.file == null ||
          value?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE ||
          FileManagementUtils.isFileFormatValid(value.file.type) ||
          t('views.scenario.scenarioParametersValidationErrors.fileFormat', 'File format not supported')
        );
      },
    },
  };
};
