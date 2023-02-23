// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UploadFile } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfigUtils, TranslationUtils, FileManagementUtils } from '../../../../utils';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';

export const GenericUploadFile = ({ parameterData, context, parameterValue, setParameterValue }) => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const parameterId = parameterData.id;
  const parameter = parameterValue || {};
  const datasetId = parameter.id;
  const defaultFileTypeFilter = ConfigUtils.getParameterAttribute(parameterData, 'defaultFileTypeFilter');

  function updateParameterValue(newValuePart) {
    setParameterValue({
      ...parameterValue,
      ...newValuePart,
    });
  }

  function setClientFileDescriptorStatus(newFileStatus) {
    updateParameterValue({
      status: newFileStatus,
    });
  }

  const labels = {
    button: t('genericcomponent.uploadfile.button.browse'),
    invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
    label: t(`solution.parameters.${parameterId}`, parameterId),
    delete: t('genericcomponent.uploadfile.tooltip.delete'),
    noFileMessage: t('genericcomponent.uploadfile.noFileMessage', 'None'),
  };

  return (
    <UploadFile
      key={parameterId}
      data-cy={`file-upload-${parameterData.id}`}
      labels={labels}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      acceptedFileTypes={defaultFileTypeFilter}
      handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, parameter, updateParameterValue)}
      handleDeleteFile={() => FileManagementUtils.prepareToDeleteFile(setClientFileDescriptorStatus)}
      handleDownloadFile={(event) => {
        event.preventDefault();
        FileManagementUtils.downloadFile(organizationId, workspaceId, datasetId, setClientFileDescriptorStatus);
      }}
      file={parameter}
      editMode={context.editMode}
    />
  );
};

GenericUploadFile.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
};
