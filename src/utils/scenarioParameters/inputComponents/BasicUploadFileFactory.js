// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import FileUpload from '../../../components/ScenarioParameters/components/tabs/FileUpload';
const create = (t, parameterData, parametersState, setParametersState, editMode) => {
  console.log('--');
  console.log(parameterData);
  console.log(parametersState);
  const parameterId = parameterData.id;
  const parameter = parametersState.files[parameterId] || {};
  console.log(parameter);

  function setParameter (newValue) {
    const updatedFiles = [...parametersState.files];
    updatedFiles[parameterId] = newValue;
    setParametersState({
      ...parametersState,
      files: updatedFiles
    });
  }

  return (
    <FileUpload
      key={parameterId}
      data-cy={parameterData.dataCy}
      label={ t(`solution.parameters.${parameterData.id}`, parameterData.id) }
      acceptedFileTypesToUpload={'*'}
      parameter={parameter}
      setParameter={setParameter}
      editMode={editMode}
    />
  );
};

export const BasicUploadFileFactory = {
  create
};
