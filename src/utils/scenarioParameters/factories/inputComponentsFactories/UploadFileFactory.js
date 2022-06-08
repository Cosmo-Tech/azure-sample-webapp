// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UploadFile } from '@cosmotech/ui';
import { FileManagementUtils } from '../../../../components/ScenarioParameters/FileManagementUtils';

const create = (t, datasets, parameterData, parametersState, setParametersState, editMode) => {
  const parameterId = parameterData.id;
  const parameter = parametersState[parameterId] || {};
  const datasetId = parameter.id;

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
  };

  return (
    <UploadFile
      key={parameterId}
      data-cy={parameterData.dataCy}
      labels={labels}
      acceptedFileTypes={parameterData.defaultFileTypeFilter}
      handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, parameter, setParameterInState)}
      handleDeleteFile={() => FileManagementUtils.prepareToDeleteFile(setClientFileDescriptorStatus)}
      handleDownloadFile={(event) => {
        event.preventDefault();
        FileManagementUtils.downloadFile(datasetId, setClientFileDescriptorStatus);
      }}
      file={parameter}
      editMode={editMode}
    />
  );
};

export const UploadFileFactory = {
  create,
};
