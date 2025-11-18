// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';

// This file regroups helper functions to manipulate data structures for "file parameters", i.e. run template parameters
// with a varType "%DATASET_PART_ID_FILE%".
// When stored in redux or in react states, file parameters will be represented by objects with the following shape:
//   {
//     parameterId: id of the run template parameter
//     datasetId: id of the dataset containing the dataset part (can be null if the file has not been uploaded yet)
//     datasetPartId: id of the dataset part (can be null if the file has not been uploaded yet)
//
//     varType: varType of the run template parameter
//     subType: subType of the run template parameter
//     status: status value as defined by the enum UPLOAD_FILE_STATUS_KEY in the @cosmotech/ui package
//
//     name: file name to display
//     value: file blob data
//
//     serialize: optional serialization function to call before uploading this file to the API; the only parameter
//       provided is the FileParameter object itself
//     serializedData: processed data received or ready to be uploaded (can be null when data has not been edited)
//     displayData: local data for visualization and edition (can be null if parameter does not need custom UI view)
//     displayStatus: table status defined by TABLE_DATA_STATUS (can be null if parameter does not need custom UI view)
//   }

export const getFileName = (fileParameterValue) => {
  return fileParameterValue?.name ?? fileParameterValue?.value?.name;
};

export const serializeBeforeUpload = (fileParameterValue) => {
  if (!fileParameterValue?.serialize) return fileParameterValue.serializedData;
  return fileParameterValue.serialize(fileParameterValue);
};

export const clearFileParameter = (fileParameterValue) => {
  return {
    ...fileParameterValue,
    value: null,
    name: null,
    status: UPLOAD_FILE_STATUS_KEY.EMPTY,
  };
};

export const forgeFileParameter = (parameterId, varType, subType, file) => {
  return {
    parameterId,
    varType,
    subType,
    datasetId: null,
    datasetPartId: null,
    value: file,
    name: null,
    status: file != null ? UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD : UPLOAD_FILE_STATUS_KEY.EMPTY,
    displayStatus: null,
    displayData: null,
  };
};

export const forgeFileParameterFromDatasetPart = (datasetPart, varType, subType) => {
  if (datasetPart == null) {
    console.error(`Cannot forge file parameter object: dataset part is undefined`);
    return;
  }

  return {
    parameterId: datasetPart.name,
    varType,
    subType,
    value: null,
    datasetId: datasetPart.datasetId,
    datasetPartId: datasetPart.id,
    name: datasetPart.sourceName,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
    displayStatus: null,
    displayData: null,
  };
};
