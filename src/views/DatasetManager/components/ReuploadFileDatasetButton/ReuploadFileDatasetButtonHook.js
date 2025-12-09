// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NATIVE_DATASOURCE_TYPES } from '../../../../services/config/ApiConstants';
import DatasetService from '../../../../services/dataset/DatasetService.js';
import { useSetApplicationErrorMessage } from '../../../../state/app/hooks';
import {
  useAddOrUpdateDatasetPartInRedux,
  useDeleteDatasetPartInRedux,
  usePollTwingraphStatus,
  useUpdateDatasetInStore,
} from '../../../../state/datasets/hooks';

export const useReuploadFileDatasetButton = () => {
  const { t } = useTranslation();
  const pollTwingraphStatus = usePollTwingraphStatus();
  const addOrUpdateDatasetPartInRedux = useAddOrUpdateDatasetPartInRedux();
  const deleteDatasetPartFromRedux = useDeleteDatasetPartInRedux();
  const updateDatasetInStore = useUpdateDatasetInStore();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  const handleFileUpload = useCallback(
    async (event, dataset) => {
      const file = event.target.files[0];
      if (file == null || dataset == null) return;

      const sourceType = dataset?.additionalData?.webapp?.sourceType;
      if (sourceType !== NATIVE_DATASOURCE_TYPES.FILE_UPLOAD) {
        console.warn(`Source type "${sourceType}" not supported in file reupload button`);
        return;
      }

      const { organizationId, workspaceId, id: datasetId } = dataset;
      const datasetParts = dataset?.parts;
      if (datasetParts.length !== 1) {
        console.warn(
          `Dataset has ${datasetParts.length} parts, but file reupload only supports datasets with one part`
        );
        return;
      }

      const datasetPartToReplace = datasetParts[0];
      const idOfDatasetPartToReplace = datasetPartToReplace?.id;
      if (idOfDatasetPartToReplace == null) {
        console.warn(`Dataset part id not found, cannot delete dataset part during file reupload`);
        return;
      }

      const datasetPartToCreate = {
        additionalData: datasetPartToReplace.additionalData,
        description: datasetPartToReplace.description,
        name: file.name,
        sourceName: file.name,
        tags: datasetPartToReplace.tags,
        type: 'File',
      };

      try {
        const createdDatasetPart = await DatasetService.replaceDatasetPart(
          organizationId,
          workspaceId,
          datasetId,
          idOfDatasetPartToReplace,
          file,
          datasetPartToCreate
        );
        addOrUpdateDatasetPartInRedux(datasetId, createdDatasetPart, undefined);
        deleteDatasetPartFromRedux(datasetId, idOfDatasetPartToReplace);
      } catch (error) {
        console.error(error);
        setApplicationErrorMessage(
          error,
          t('commoncomponents.banner.datasetFileReuploadFailed', 'The file upload for dataset update has failed')
        );
      }
    },
    [t, addOrUpdateDatasetPartInRedux, deleteDatasetPartFromRedux, setApplicationErrorMessage]
  );

  return { handleFileUpload, pollTwingraphStatus, setApplicationErrorMessage, updateDatasetInStore };
};
