// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UPLOAD_FILE_STATUS_KEY as FILE_STATUS } from '@cosmotech/ui';
import { FILE_DATASET_PART_ID_VARTYPE } from '../services/config/ApiConstants';
import DatasetService from '../services/dataset/DatasetService';
import { useSetApplicationErrorMessage } from '../state/app/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import { useSolutionData } from '../state/solutions/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { SolutionsUtils } from '../utils';
import { clearFileParameter, getFileName, serializeBeforeUpload } from '../utils/scenarioParameters/FileParameterUtils';

export const useFileParameters = () => {
  const { t } = useTranslation();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const solution = useSolutionData();

  const { getValues, setValue } = useFormContext() ?? {};
  const isInFormContext = useMemo(() => getValues == null, [getValues]);

  const downloadDatasetPartFile = useCallback(
    async (parameterValue, setStatus) => {
      const datasetPart = {
        organizationId,
        workspaceId,
        datasetId: parameterValue.datasetId,
        id: parameterValue.datasetPartId,
        sourceName: getFileName(parameterValue),
      };

      try {
        setStatus(FILE_STATUS.DOWNLOADING);
        await DatasetService.downloadDatasetPart(datasetPart);
        setStatus(FILE_STATUS.READY_TO_DOWNLOAD);
      } catch (error) {
        console.error(error);
        const errorMessage = t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded.");
        setApplicationErrorMessage(error, errorMessage);
      }
    },
    [t, organizationId, workspaceId, setApplicationErrorMessage]
  );

  const downloadDatasetPartFileData = useCallback(
    async (parameterValue, setStatus) => {
      const datasetPart = {
        organizationId,
        workspaceId,
        datasetId: parameterValue.datasetId,
        id: parameterValue.datasetPartId,
        sourceName: getFileName(parameterValue),
      };

      try {
        setStatus(FILE_STATUS.DOWNLOADING);
        const data = await DatasetService.fetchDatasetPartData(datasetPart);
        setStatus(FILE_STATUS.READY_TO_DOWNLOAD);
        return data;
      } catch (error) {
        console.error(error);
        const errorMessage = t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded.");
        setApplicationErrorMessage(error, errorMessage);
      }
    },
    [t, organizationId, workspaceId, setApplicationErrorMessage]
  );

  // Update internal data of file parameters based on their status (e.g. generate CSV files that will be uploaded)
  const processFilesToUpload = useCallback(() => {
    if (!isInFormContext) return;

    const parameterValues = getValues();
    const updateParameterValue = (parameterId, newValue) => {
      const currentValue = parameterValues[parameterId];
      setValue(parameterId, { ...currentValue, ...newValue });
    };

    // Setter to update file descriptors status in the React component state
    const setParameterValueStatus = (parameterId, newStatus) => {
      updateParameterValue(parameterId, { status: newStatus });
    };

    for (const [parameterId, parameterValue] of Object.entries(parameterValues)) {
      const varType = SolutionsUtils.getParameterVarType(solution, parameterId);
      // TODO: add support for edition of DB parameters
      if (varType === FILE_DATASET_PART_ID_VARTYPE) {
        const fileStatus = parameterValue?.status;
        if (fileStatus === FILE_STATUS.READY_TO_UPLOAD) {
          if (parameterValue?.serialize != null) {
            try {
              setParameterValueStatus(parameterId, FILE_STATUS.UPLOADING); // Actually only "processing"
              const serializedData = serializeBeforeUpload(parameterValue);
              updateParameterValue(parameterId, { serializedData, status: FILE_STATUS.READY_TO_UPLOAD });
            } catch (error) {
              setParameterValueStatus(parameterId, FILE_STATUS.READY_TO_UPLOAD);
              throw error;
            }
          }
        } else if (fileStatus === FILE_STATUS.READY_TO_DELETE) {
          setParameterValueStatus(parameterId, FILE_STATUS.EMPTY);
          updateParameterValue(parameterId, clearFileParameter(parameterValue));
        } else if (fileStatus === FILE_STATUS.READY_TO_DOWNLOAD || fileStatus === FILE_STATUS.EMPTY) {
          continue;
        } else {
          console.warn(`Unknown file status "${fileStatus}"`);
        }
      }
    }
  }, [setValue, getValues, solution, isInFormContext]);

  // Update status and internal data of file parameters after runner parameters have been saved
  const updateSavedFileParameters = useCallback(
    (createdDatasetParts, deletedDatasetPartIds) => {
      if (!isInFormContext) return;

      const parameterValues = getValues();
      const updateParameterValue = (parameterId, newValue) => {
        setValue(parameterId, { ...parameterValues[parameterId], ...newValue });
      };

      for (const [parameterId, parameterValue] of Object.entries(parameterValues)) {
        const varType = SolutionsUtils.getParameterVarType(solution, parameterId);
        if (varType !== FILE_DATASET_PART_ID_VARTYPE) continue;

        if (deletedDatasetPartIds.includes(parameterValue.datasetPartId))
          updateParameterValue(parameterId, clearFileParameter(parameterValue));

        const createdDatasetPart = createdDatasetParts.find((part) => part.name === parameterId);
        if (createdDatasetPart) {
          updateParameterValue(parameterId, {
            parameterId: createdDatasetPart.name,
            datasetId: createdDatasetPart.datasetId,
            datasetPartId: createdDatasetPart.id,
            name: createdDatasetPart.sourceName,
            status: FILE_STATUS.READY_TO_DOWNLOAD,
          });
        }
      }
    },
    [setValue, getValues, solution, isInFormContext]
  );

  return {
    downloadDatasetPartFile,
    downloadDatasetPartFileData,
    processFilesToUpload,
    updateSavedFileParameters,
  };
};
