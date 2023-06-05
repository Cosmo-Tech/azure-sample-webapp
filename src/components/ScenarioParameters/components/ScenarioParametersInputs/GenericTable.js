// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState, useRef } from 'react';
import rfdc from 'rfdc';
import equal from 'fast-deep-equal';
import { Table, TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { AgGridUtils, FileBlobUtils } from '@cosmotech/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TableExportDialog } from './components';
import { gridLight, gridDark } from '../../../../theme/';
import { ConfigUtils, TranslationUtils, FileManagementUtils } from '../../../../utils';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';

const clone = rfdc();

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const MAX_ERRORS_COUNT = 100;

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

export const GenericTable = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  resetParameterValue,
  isDirty,
}) => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const datasets = useSelector((state) => state.dataset?.list?.data);
  const scenarioId = useSelector((state) => state.scenario?.current?.data?.id);

  const parameterId = parameterData.id;
  const [parameter, setParameter] = useState(parameterValue || {});

  const lockId = `${scenarioId}_${parameterId}`;

  const tableLabels = {
    label: t(`solution.parameters.${parameterId}`, parameterId),
    loading: t('genericcomponent.table.labels.loading', 'Loading...'),
    clearErrors: t('genericcomponent.table.button.clearErrors', 'Clear'),
    errorsPanelMainError: t('genericcomponent.table.labels.fileImportError', 'File load failed.'),
    placeholderTitle: t('genericcomponent.table.labels.placeholdertitle'),
    placeholderBody: t('genericcomponent.table.labels.placeholderbody'),
    import: t('genericcomponent.table.labels.import'),
    export: t('genericcomponent.table.labels.export'),
    fullscreen: t('genericcomponent.table.labels.fullscreen'),
  };
  const tableExportDialogLabels = {
    cancel: t('genericcomponent.table.export.labels.cancel', 'Cancel'),
    export: t('genericcomponent.table.export.labels.export', 'Export'),
    fileNameInputLabel: t('genericcomponent.table.export.labels.fileNameInputLabel', 'Name'),
    fileTypeSelectLabel: t('genericcomponent.table.export.labels.fileTypeSelectLabel', 'Type'),
    title: t('genericcomponent.table.export.labels.title', 'Export file'),
    exportDescription: t(
      'genericcomponent.table.export.labels.exportDescription',
      'Your file will be saved on your computer.'
    ),
  };

  const columns = ConfigUtils.getParameterAttribute(parameterData, 'columns');
  const dateFormat = ConfigUtils.getParameterAttribute(parameterData, 'dateFormat') || DEFAULT_DATE_FORMAT;
  const options = { dateFormat };

  const isUnmount = useRef(false);
  const gridApiRef = useRef();
  useEffect(() => {
    return () => {
      isUnmount.current = true;
      gridApiRef.current = undefined;
    };
  }, []);

  // Store last parameter in a ref
  // Update a state is async, so, in case of multiple call of updateParameterValue in same function
  // parameter state value will be update only in last call.
  // We need here to use a ref value for be sure to have the good value.
  const lastNewParameterValue = useRef(parameter);
  const updateParameterValue = (newValuePart, shouldReset = false) => {
    const newParameterValue = {
      ...lastNewParameterValue.current,
      ...newValuePart,
    };

    lastNewParameterValue.current = newParameterValue;

    if (!isUnmount.current) {
      setParameter(newParameterValue);
    }

    // Update parameterValue in another process to allow grid to update parameter before.
    // if not, the parent should update parameterValue in same time that grid refreshing by update local parameter.
    setTimeout(() => {
      // Prevent useless update of parameterValue if multiple updateParameterValue was done before
      if (lastNewParameterValue.current === newParameterValue) {
        if (shouldReset) {
          resetParameterValue(newParameterValue);
        } else {
          setParameterValue(newParameterValue);
        }
      }
    });
  };

  const updateParameterValueWithReset = (newValuePart) => {
    updateParameterValue(newValuePart, true);
  };

  useEffect(() => {
    if (
      parameterValue?.status !== parameter.status ||
      !equal(parameterValue?.errors, parameter.errors) ||
      !equal(parameterValue?.agGridRows, parameter.agGridRows)
    ) {
      lastNewParameterValue.current = parameterValue;
      setParameter(parameterValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameterValue]);

  const setClientFileDescriptorStatuses = (newFileStatus, newTableDataStatus, shouldReset = false) => {
    updateParameterValue(
      {
        status: newFileStatus,
        tableDataStatus: newTableDataStatus,
      },
      shouldReset
    );
  };

  const setClientFileDescriptorStatusesWithReset = (newFileStatus, newTableDataStatus) => {
    setClientFileDescriptorStatuses(newFileStatus, newTableDataStatus, true);
  };

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
      file: null,
      content: null,
      agGridRows: null,
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
      setClientFileDescriptorStatusesWithReset
    );

    if (data) {
      const fileName = clientFileDescriptor.name;
      const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD;
      _parseCSVFileContent(data, fileName, clientFileDescriptor, setClientFileDescriptor, finalStatus);
    } else {
      setClientFileDescriptor({
        file: null,
        content: null,
        errors: null,
        agGridRows: null,
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
      name: fileName,
      file: null,
      agGridRows: null,
      errors: null,
      content: fileContent,
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
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
          errors: agGridData.error,
        });
      }
    } else {
      setClientFileDescriptor({
        name: fileName,
        file: null,
        agGridRows: agGridData.rows,
        errors: agGridData.error,
        content: fileContent,
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
      name: file.name,
      file: null,
      content: null,
      agGridRows: null,
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
      name: file.name,
      file,
      content: null,
      agGridRows: null,
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
        name: file.name,
        file: null,
        content: newFileContent,
        agGridRows: agGridData.rows,
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
    const file = FileManagementUtils.prepareToUpload(event, parameter, updateParameterValue);
    if (file.name.endsWith('.csv')) {
      _readAndParseCSVFile(file, parameter, updateParameterValue, previousFileBackup);
    } else if (file.name.endsWith('.xlsx')) {
      _readAndParseXLSXFile(file, parameter, updateParameterValue, previousFileBackup);
    } else {
      updateParameterValue({
        errors: [{ summary: 'Unknown file type, please provide a CSV or XLSX file.', loc: file.name }],
      });
    }
  };

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const openExportDialog = () => setIsExportDialogOpen(true);
  const closeExportDialog = () => setIsExportDialogOpen(false);
  const exportTable = (fileName) => {
    closeExportDialog();
    exportFile(fileName);
  };

  const exportFile = (fileName) => {
    if (fileName.toLowerCase().endsWith('.xlsx')) exportXSLX(fileName);
    else exportCSV(fileName);
  };

  const exportCSV = (fileName) => {
    const fileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    FileBlobUtils.downloadFileFromData(fileContent, fileName);
  };
  const exportXSLX = (fileName) => {
    const fileContent = AgGridUtils.toXLSX(parameter.agGridRows, columns, options);
    FileBlobUtils.downloadFileFromData(fileContent, fileName);
  };

  const _uploadPreprocess = (clientFileDescriptor) => {
    const newFileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
    updateParameterValue({
      content: newFileContent,
    });
    gridApiRef.current?.stopEditing();
    return newFileContent;
  };

  const onCellChange = (event) => {
    gridApiRef.current = event.api;
    if (!parameter.uploadPreprocess || !isDirty) {
      updateParameterValue({
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        errors: null,
        uploadPreprocess: { content: _uploadPreprocess },
      });
    }
  };

  const onClearErrors = () => {
    updateParameterValue({
      errors: null,
    });
  };

  const buildErrorsPanelTitle = (errorsCount, maxErrorsCount) => {
    let title = t('genericcomponent.table.labels.errorsCount', '{{count}} errors occurred:', {
      count: errorsCount,
    });
    if (errorsCount > maxErrorsCount) {
      title +=
        ' ' +
        t('genericcomponent.table.labels.maxErrorsCount', '(only the top first {{maxCount}} results)', {
          maxCount: maxErrorsCount,
        });
    }
    return title;
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
      _downloadDatasetFileContentFromStorage(
        organizationId,
        workspaceId,
        datasets,
        parameter,
        updateParameterValueWithReset
      );
    }
  });

  return (
    <>
      <TableExportDialog
        defaultFileName={parameterId}
        labels={tableExportDialogLabels}
        open={isExportDialogOpen}
        onClose={closeExportDialog}
        onExport={exportTable}
      />
      <Table
        key={parameterId}
        data-cy={`table-${parameterData.id}`}
        labels={tableLabels}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        dateFormat={dateFormat}
        editMode={context.editMode}
        dataStatus={parameter.tableDataStatus || TABLE_DATA_STATUS.EMPTY}
        errors={parameter.errors}
        columns={columns}
        rows={parameter.agGridRows || []}
        agTheme={context.isDarkTheme ? gridDark.agTheme : gridLight.agTheme}
        onImport={importFile}
        onExport={openExportDialog}
        onCellChange={onCellChange}
        onClearErrors={onClearErrors}
        buildErrorsPanelTitle={buildErrorsPanelTitle}
        maxErrorsCount={MAX_ERRORS_COUNT}
        isDirty={isDirty}
      />
    </>
  );
};

GenericTable.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  resetParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericTable.defaultProps = {
  isDirty: false,
};
