// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UploadFile } from '@cosmotech/ui';
import { FileManagementUtils } from '../../../../components/ScenarioParameters/FileManagementUtils';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfigUtils } from '../../../../utils/ConfigUtils';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';

export const GenericUploadFile = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const parameterId = parameterData.id;
  const parameter = parametersState[parameterId] || {};
  const datasetId = parameter.id;
  const defaultFileTypeFilter = ConfigUtils.getParameterAttribute(parameterData, 'defaultFileTypeFilter');

  function setParameterInState(newValuePart) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterId]: {
        ...currentParametersState[parameterId],
        ...newValuePart,
      },
    }));
  }

  function setClientFileDescriptorStatus(newFileStatus) {
    setParameterInState({
      status: newFileStatus,
    });
  }

  const labels = {
    button: t('genericcomponent.uploadfile.button.browse'),
    invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
    label: t(`solution.parameters.${parameterId}`, parameterId),
    delete: t('genericcomponent.uploadfile.tooltip.delete'),
  };

  return (
    <UploadFile
      key={parameterId}
      data-cy={`file-upload-${parameterData.id}`}
      labels={labels}
      acceptedFileTypes={defaultFileTypeFilter}
      handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, parameter, setParameterInState)}
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
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
