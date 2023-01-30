// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import rfdc from 'rfdc';
import { Table, TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { AgGridUtils, FileBlobUtils } from '@cosmotech/core';
import { Button } from '@material-ui/core';
import { FileManagementUtils } from '../../../../components/ScenarioParameters/FileManagementUtils';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { gridLight, gridDark } from '../../../../theme/';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';

const clone = rfdc();

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

const _generateGridDataFromCSV = (fileContent, parameterData, options) => {
  return AgGridUtils.fromCSV(
    fileContent,
    ConfigUtils.getParameterAttribute(parameterData, 'hasHeader') || true,
    ConfigUtils.getParameterAttribute(parameterData, 'columns'),
    options
  );
};

const _generateGridDataFromXLSX = async (fileBlob, parameterData, options) => {
  return await AgGridUtils.fromXLSX(
    fileBlob,
    ConfigUtils.getParameterAttribute(parameterData, 'hasHeader') || true,
    ConfigUtils.getParameterAttribute(parameterData, 'columns'),
    options
  );
};

export const GenericTable = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const datasets = useSelector((state) => state.dataset?.list?.data);
  const scenarioId = useSelector((state) => state.scenario?.current?.data?.id);

  const parameterId = parameterData.id;
  const parameter = parametersState[parameterId] || {};
  const lockId = `${scenarioId}_${parameterId}`;

  const labels = {
    label: t(`solution.parameters.${parameterId}`, parameterId),
    loading: t('genericcomponent.table.labels.loading', 'Loading...'),
    clearErrors: t('genericcomponent.table.button.clearErrors', 'Clear'),
    errorsPanelMainError: t('genericcomponent.table.labels.fileImportError', 'File load failed.'),
  };
  const columns = ConfigUtils.getParameterAttribute(parameterData, 'columns');
  const dateFormat = ConfigUtils.getParameterAttribute(parameterData, 'dateFormat') || DEFAULT_DATE_FORMAT;
  const options = { dateFormat };

  function setParameterInState(newValuePart) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterId]: {
        ...currentParametersState[parameterId],
        ...newValuePart,
      },
    }));
  }

  function setClientFileDescriptorStatuses(newFileStatus, newTableDataStatus) {
    setParameterInState({
      status: newFileStatus,
      tableDataStatus: newTableDataStatus,
    });
  }

  const _checkForLock = () => {
    if (GenericTable.downloadLocked === undefined) {
      GenericTable.downloadLocked = {};
    } else if (lockId in GenericTable.downloadLocked === false) {
      GenericTable.downloadLocked[lockId] = false;
    } else if (GenericTable.downloadLocked[lockId]) {
      return true;
    }
    return false;
  };

  const _downloadDatasetFileContentFromStorage = async (
    organizationId,
    workspaceId,
    datasets,
    clientFileDescriptor,
    setClientFileDescriptor
  ) => {
    // Setting the table status to DOWNLOADING again even when the download is already active (and thus locked) seems
    // to fix a race condition in the table parameter state. This can be used to fix the missing loading spinner.
    setClientFileDescriptor({
      agGridRows: null,
      file: null,
      content: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
      tableDataStatus: TABLE_DATA_STATUS.DOWNLOADING,
    });

    if (_checkForLock()) {
      return;
    }
    GenericTable.downloadLocked[lockId] = true;

    const datasetId = clientFileDescriptor.id;
    const data = await FileManagementUtils.downloadFileData(
      organizationId,
      workspaceId,
      datasets,
      datasetId,
      setClientFileDescriptorStatuses
    );

    if (data) {
      const fileName = clientFileDescriptor.name;
      const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD;
      _parseCSVFileContent(data, fileName, clientFileDescriptor, setClientFileDescriptor, finalStatus);
    } else {
      setClientFileDescriptor({
        agGridRows: null,
        file: null,
        content: null,
        errors: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
        tableDataStatus: TABLE_DATA_STATUS.ERROR,
      });
    }
    GenericTable.downloadLocked[lockId] = false;
  };

  const _parseCSVFileContent = (
    fileContent,
    fileName,
    clientFileDescriptor,
    setClientFileDescriptor,
    finalStatus,
    clientFileDescriptorRestoreValue
  ) => {
    setClientFileDescriptor({
      agGridRows: null,
      name: fileName,
      file: null,
      content: fileContent,
      errors: null,
      status: finalStatus,
      tableDataStatus: TABLE_DATA_STATUS.PARSING,
    });

    const agGridData = _generateGridDataFromCSV(fileContent, parameterData, options);
    if (agGridData.error) {
      if (clientFileDescriptorRestoreValue) {
        setClientFileDescriptor({
          ...clientFileDescriptorRestoreValue,
          errors: agGridData.error,
        });
      } else {
        setClientFileDescriptor({
          errors: agGridData.error,
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
        });
      }
    } else {
      setClientFileDescriptor({
        agGridRows: agGridData.rows,
        name: fileName,
        file: null,
        content: fileContent,
        errors: agGridData.error,
        status: finalStatus,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        uploadPreprocess: null,
      });
    }
  };

  const _readAndParseCSVFile = (
    file,
    clientFileDescriptor,
    setClientFileDescriptor,
    clientFileDescriptorRestoreValue
  ) => {
    if (!file) {
      return;
    }

    setClientFileDescriptor({
      agGridRows: null,
      name: file.name,
      file: null,
      content: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
      tableDataStatus: TABLE_DATA_STATUS.UPLOADING,
    });
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD;
      _parseCSVFileContent(
        fileContent,
        file.name,
        clientFileDescriptor,
        setClientFileDescriptor,
        finalStatus,
        clientFileDescriptorRestoreValue
      );
    };

    reader.readAsText(file);
  };

  const _readAndParseXLSXFile = async (
    file,
    clientFileDescriptor,
    setClientFileDescriptor,
    clientFileDescriptorRestoreValue
  ) => {
    if (!file) {
      return;
    }
    setClientFileDescriptor({
      agGridRows: null,
      name: file.name,
      file,
      content: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
      tableDataStatus: TABLE_DATA_STATUS.PARSING,
    });

    const agGridData = await _generateGridDataFromXLSX(file, parameterData, options);
    if (agGridData.error) {
      if (clientFileDescriptorRestoreValue) {
        setClientFileDescriptor({
          ...clientFileDescriptorRestoreValue,
          errors: agGridData.error,
        });
      } else {
        setClientFileDescriptor({
          errors: agGridData.error,
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
        });
      }
    } else {
      const newFileContent = AgGridUtils.toCSV(
        agGridData.rows,
        ConfigUtils.getParameterAttribute(parameterData, 'columns'),
        options
      );
      setClientFileDescriptor({
        agGridRows: agGridData.rows,
        name: file.name,
        file: null,
        content: newFileContent,
        errors: agGridData.error,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        uploadPreprocess: null,
      });
    }
  };

  const importFile = (event) => {
    // TODO: ask confirmation if data already exist
    const previousFileBackup = clone(parameter);
    const file = FileManagementUtils.prepareToUpload(event, parameter, setParameterInState);
    if (file.name.endsWith('.csv')) {
      _readAndParseCSVFile(file, parameter, setParameterInState, previousFileBackup);
    } else if (file.name.endsWith('.xlsx')) {
      _readAndParseXLSXFile(file, parameter, setParameterInState, previousFileBackup);
    } else {
      setParameterInState({
        errors: [{ summary: 'Unknown file type, please provide a CSV or XLSX file.', loc: file.name }],
      });
    }
  };

  const exportCSV = (event) => {
    const fileName = parameterId.concat('.csv');
    const fileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    FileBlobUtils.downloadFileFromData(fileContent, fileName);
  };

  const _uploadPreprocess = (parameterData, clientFileDescriptor, setClientFileDescriptorStatus) => {
    const newFileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    setParameterInState({
      content: newFileContent,
    });
    return newFileContent;
  };

  const onCellChange = (event) => {
    if (!parameter.uploadPreprocess) {
      setParameterInState({
        errors: [],
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        uploadPreprocess: { content: _uploadPreprocess },
      });
    }
  };

  const onClearErrors = () => {
    setParameterInState({
      errors: [],
    });
  };

  const buildErrorsPanelTitle = (errorsCount) => {
    return t('genericcomponent.table.labels.errorsCount', '{{count}} errors occured:', {
      count: errorsCount,
    });
  };

  const alreadyDownloaded =
    parameter.tableDataStatus !== undefined &&
    [
      TABLE_DATA_STATUS.ERROR,
      TABLE_DATA_STATUS.DOWNLOADING,
      TABLE_DATA_STATUS.PARSING,
      TABLE_DATA_STATUS.READY,
    ].includes(parameter.tableDataStatus);

  // Trigger dataset download only when mounting the component
  useEffect(() => {
    if (
      parameter.id &&
      !parameter.content &&
      parameter.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD &&
      !alreadyDownloaded
    ) {
      _downloadDatasetFileContentFromStorage(organizationId, workspaceId, datasets, parameter, setParameterInState);
    }
  });

  const csvImportButton = (
    <Button
      key="import-file-button"
      data-cy="import-file-button"
      disabled={!context.editMode}
      color="primary"
      variant="outlined"
      component="label"
      onChange={importFile}
    >
      {t('genericcomponent.table.button.fileImport')}
      <input type="file" accept=".csv, .xlsx" hidden />
    </Button>
  );

  const csvExportButton = (
    <Button
      style={{ marginLeft: '16px' }}
      key="export-csv-button"
      data-cy="export-csv-button"
      color="primary"
      variant="outlined"
      component="label"
      onClick={exportCSV}
    >
      {t('genericcomponent.table.button.csvExport')}
    </Button>
  );

  const extraToolbarActions = [csvImportButton, csvExportButton];

  return (
    <Table
      key={parameterId}
      data-cy={`table-${parameterData.id}`}
      labels={labels}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      dateFormat={dateFormat}
      editMode={context.editMode}
      dataStatus={parameter.tableDataStatus || TABLE_DATA_STATUS.EMPTY}
      errors={parameter.errors}
      columns={columns}
      rows={parameter.agGridRows || []}
      agTheme={context.isDarkTheme ? gridDark.agTheme : gridLight.agTheme}
      extraToolbarActions={extraToolbarActions}
      onCellChange={onCellChange}
      onClearErrors={onClearErrors}
      buildErrorsPanelTitle={buildErrorsPanelTitle}
    />
  );
};

GenericTable.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
