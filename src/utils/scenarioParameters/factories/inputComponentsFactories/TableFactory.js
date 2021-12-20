// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import rfdc from 'rfdc';
import { Table, TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { AgGridUtils, FileBlobUtils } from '@cosmotech/core';
import theme from '../../../../theme';
import { Button } from '@material-ui/core';
import { FileManagementUtils } from '../../../../components/ScenarioParameters/FileManagementUtils';

const clone = rfdc();

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

const _generateGridDataFromCSV = (fileContent, parameterMetadata, options) => {
  return AgGridUtils.fromCSV(fileContent, parameterMetadata.hasHeader || true, parameterMetadata.columns, options);
};

const _generateGridDataFromXLSX = async (fileBlob, parameterMetadata, options) => {
  return await AgGridUtils.fromXLSX(fileBlob, parameterMetadata.hasHeader || true, parameterMetadata.columns, options);
};

const create = (t, datasets, parameterMetadata, parametersState, setParametersState, editMode) => {
  const parameterId = parameterMetadata.id;
  const parameter = parametersState[parameterId] || {};

  const labels = {
    label: t(`solution.parameters.${parameterId}`, parameterId),
    loading: t('genericcomponent.table.labels.loading', 'Loading...'),
    clearErrors: t('genericcomponent.table.button.clearErrors', 'Clear'),
    errorsPanelMainError: t('genericcomponent.table.labels.fileImportError', 'File load failed.'),
  };
  const columns = parameterMetadata.columns;
  const dateFormat = parameterMetadata.dateFormat || DEFAULT_DATE_FORMAT;
  const options = { dateFormat: dateFormat };

  const setParameterInState = (newValue) => {
    setParametersState({
      ...parametersState,
      [parameterId]: newValue,
    });
  };

  const setClientFileDescriptorStatuses = (newFileStatus, newTableDataStatus) => {
    setParameterInState({
      ...parameter,
      status: newFileStatus,
      tableDataStatus: newTableDataStatus,
    });
  };

  const _downloadDatasetFileContentFromStorage = async (datasets, clientFileDescriptor, setClientFileDescriptor) => {
    if (create.downloadLocked === undefined) {
      create.downloadLocked = false;
    } else if (create.downloadLocked) {
      return;
    }
    create.downloadLocked = true;
    setClientFileDescriptor({
      ...clientFileDescriptor,
      agGridRows: null,
      name: clientFileDescriptor.name,
      file: null,
      content: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
      tableDataStatus: TABLE_DATA_STATUS.DOWNLOADING,
    });

    const datasetId = clientFileDescriptor.id;
    const data = await FileManagementUtils.downloadFileData(datasets, datasetId, setClientFileDescriptorStatuses);
    if (data) {
      const fileName = clientFileDescriptor.name;
      const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD;
      _parseCSVFileContent(data, fileName, clientFileDescriptor, setClientFileDescriptor, finalStatus);
    } else {
      setClientFileDescriptor({
        ...clientFileDescriptor,
        agGridRows: null,
        name: clientFileDescriptor.name,
        file: null,
        content: null,
        errors: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
        tableDataStatus: TABLE_DATA_STATUS.ERROR,
      });
    }
    create.downloadLocked = false;
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
      ...clientFileDescriptor,
      agGridRows: null,
      name: fileName,
      file: null,
      content: fileContent,
      errors: null,
      status: finalStatus,
      tableDataStatus: TABLE_DATA_STATUS.PARSING,
    });

    const agGridData = _generateGridDataFromCSV(fileContent, parameterMetadata, options);
    if (agGridData.error) {
      if (clientFileDescriptorRestoreValue) {
        setClientFileDescriptor({
          ...clientFileDescriptorRestoreValue,
          errors: agGridData.error,
        });
      } else {
        setClientFileDescriptor({
          ...clientFileDescriptor,
          errors: agGridData.error,
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
        });
      }
    } else {
      setClientFileDescriptor({
        ...clientFileDescriptor,
        agGridRows: agGridData.rows,
        name: fileName,
        file: null,
        content: fileContent,
        errors: agGridData.error,
        status: finalStatus,
        tableDataStatus: TABLE_DATA_STATUS.READY,
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
      ...clientFileDescriptor,
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
      ...clientFileDescriptor,
      agGridRows: null,
      name: file.name,
      file: file,
      content: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
      tableDataStatus: TABLE_DATA_STATUS.PARSING,
    });

    const agGridData = await _generateGridDataFromXLSX(file, parameterMetadata, options);
    if (agGridData.error) {
      if (clientFileDescriptorRestoreValue) {
        setClientFileDescriptor({
          ...clientFileDescriptorRestoreValue,
          errors: agGridData.error,
        });
      } else {
        setClientFileDescriptor({
          ...clientFileDescriptor,
          errors: agGridData.error,
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
        });
      }
    } else {
      const newFileContent = AgGridUtils.toCSV(agGridData.rows, parameterMetadata.columns, options);
      setClientFileDescriptor({
        ...clientFileDescriptor,
        agGridRows: agGridData.rows,
        name: file.name,
        file: null,
        content: newFileContent,
        errors: agGridData.error,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
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
        ...parameter,
        errors: [{ summary: 'Unknown file type, please provide a CSV or XLSX file.', loc: file.name }],
      });
    }
  };

  const exportCSV = (event) => {
    const fileName = parameterId.concat('.csv');
    const fileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    FileBlobUtils.downloadFileFromData(fileContent, fileName);
  };

  const _uploadPreprocess = (parameterMetadata, clientFileDescriptor, setClientFileDescriptorStatus) => {
    const newFileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    setParameterInState({
      ...parameter,
      content: newFileContent,
    });
    return newFileContent;
  };

  const onCellChange = (event) => {
    if (!parameter.uploadPreprocess) {
      setParameterInState({
        ...parameter,
        errors: [],
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        uploadPreprocess: { content: _uploadPreprocess },
      });
    }
  };

  const onClearErrors = () => {
    setParameterInState({
      ...parameter,
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
    [TABLE_DATA_STATUS.ERROR, TABLE_DATA_STATUS.DOWNLOADING, TABLE_DATA_STATUS.PARSING].includes(
      parameter.tableDataStatus
    );
  if (
    parameter.id &&
    !parameter.content &&
    parameter.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD &&
    !alreadyDownloaded
  ) {
    _downloadDatasetFileContentFromStorage(datasets, parameter, setParameterInState);
  }

  const csvImportButton = (
    <Button
      key="import-file-button"
      data-cy="import-file-button"
      disabled={!editMode}
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
      data-cy={parameterMetadata.dataCy}
      labels={labels}
      dateFormat={dateFormat}
      editMode={editMode}
      dataStatus={parameter.tableDataStatus}
      errors={parameter.errors}
      columns={columns}
      rows={parameter.agGridRows || []}
      agTheme={theme.grid.agTheme}
      extraToolbarActions={extraToolbarActions}
      onCellChange={onCellChange}
      onClearErrors={onClearErrors}
      buildErrorsPanelTitle={buildErrorsPanelTitle}
    />
  );
};

export const TableFactory = {
  create,
};
