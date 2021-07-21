// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { STORAGE_ROOT_DIR_PLACEHOLDER, UploadFileUtils } from '../../components/ScenarioParameters/UploadFileUtils';
import { WorkspaceFileUtils } from '@cosmotech/core';
import DatasetService from '../dataset/DatasetService';

class WorkspaceService {
  constructor (apiService) {
    this.apiService = apiService;
    this.workspaceApi = new apiService.WorkspaceApi();
    this.datasetApi = new apiService.DatasetApi();
  }

  async uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
    const workspace = await this.workspaceApi.uploadWorkspaceFile(organizationId, workspaceId, file, { overwrite: overwrite, destination: destination });
    return workspace;
  }

  async updateDatasetPartFile (organisationId, dataset, datasetFile, setDatasetFile,
    datasetId, setDatasetId, parameterId, connectorId, scenarioId, workspaceId) {
    if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
      await this.updateFileWithUpload(organisationId, datasetFile, setDatasetFile, dataset, datasetId,
        parameterId, connectorId, scenarioId, workspaceId, datasetFile.name);
    } else if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
      await UploadFileUtils.updateFileWithDelete(datasetFile, setDatasetFile, dataset, datasetId,
        setDatasetId);
    }
  }

  async updateFileWithUpload (organisationId, datasetFile, setDatasetFile, dataset,
    datasetId, parameterId, connectorId, scenarioId, workspaceId, fileName) {
    /*
         FIXME:  Due to parametersValues inheritance, the workspace file deletion leads
          to incoherent state when a dataset part file is uploaded.
          For the moment, the workspace file deletion in omitted. This will be fixed in next version
    */
    // Create new dataset
    const tags = ['dataset_part'];
    try {
      const createdDataset = await new DatasetService(this.apiService).createDataset(
        organisationId, datasetFile.parameterId, datasetFile.description, { id: connectorId }, tags);
      const datasetId = createdDataset.id;

      const datasetTargetPath = UploadFileUtils.buildStorageFilePath(datasetId, fileName);

      const connectorInfo = UploadFileUtils.createConnector(connectorId, datasetTargetPath);
      createdDataset.connector = connectorInfo;

      const updatedDataset = await this.datasetApi.updateDataset(
        organisationId, datasetId, createdDataset);
      dataset.current = updatedDataset;
      // File has been marked to be uploaded
      await this.uploadFile(organisationId, dataset, datasetFile, setDatasetFile, workspaceId, datasetTargetPath);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    } catch (e) {
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD });
      console.error(e);
    }
  }

  async uploadFile (organisationId, dataset, datasetFile, setDatasetFile, workspaceId, storageFilePath) {
    try {
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.UPLOADING });
      const overwrite = true;
      const file = await this.uploadWorkspaceFile(organisationId, workspaceId, datasetFile.file, overwrite, storageFilePath);
      // Handle unlikely case where currentDataset.current is null or undefined
      // which is most likely to require a manual clean on the backend.
      if (!dataset.current) {
        console.warn('Your previous file was in an awkward state. The backend may not be clean.');
      } else if (Object.keys(dataset.current).length !== 0) {
        UploadFileUtils.updatePathInDatasetRef(dataset, STORAGE_ROOT_DIR_PLACEHOLDER + file.fileName);
      }
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    } catch (e) {
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD });
      console.error(e);
    }
  }

  async downloadFile (defaultBasePath, accessToken, organisationId, workspaceId, dataset, datasetFile, setDatasetFile) {
    const datasetId = dataset.current.id;
    try {
      const datasetFound = await this.datasetApi.findDatasetById(organisationId, datasetId);
      const storageFilePath = UploadFileUtils.getStorageFilePathFromDataset(datasetFound);
      if (storageFilePath !== undefined) {
        setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.DOWNLOADING });
        await WorkspaceFileUtils.fetchWorkspaceFile(defaultBasePath, accessToken, organisationId, workspaceId, storageFilePath);
        setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
      }
    } catch (e) {
      console.error(e);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
      throw new Error(`Error finding dataset ${datasetId}`);
    }
  }
}

export default WorkspaceService;
