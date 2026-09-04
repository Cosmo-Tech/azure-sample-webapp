// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import rfdc from 'rfdc';
import { AgGridUtils, FileBlobUtils } from '@cosmotech/core';
import { Table, TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { useFileParameters } from '../../../../hooks/FileParameterHooks';
import DatasetService from '../../../../services/dataset/DatasetService';
import { useOrganizationId } from '../../../../state/organizations/hooks';
import { useCurrentSimulationRunnerId } from '../../../../state/runner/hooks';
import { useWorkspaceId } from '../../../../state/workspaces/hooks.js';
import { gridLight, gridDark } from '../../../../theme/';
import { ConfigUtils, DatasetsUtils, TranslationUtils } from '../../../../utils';
import { parseCSVFromAPIResponse } from '../../../../utils/DatasetQueryUtils';
import { FileManagementUtils } from '../../../../utils/FileManagementUtils';
import { TableUtils } from '../../../../utils/TableUtils';
import { TableExportDialog, TableRevertDataDialog, TableDeleteRowsDialog } from './components';

const clone = rfdc();

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const MAX_ERRORS_COUNT = 100;

const _generateGridDataFromCSV = (fileContent, parameterData, options) => {
  return AgGridUtils.fromCSV(
    fileContent,
    ConfigUtils.getParameterAttribute(parameterData, 'hasHeader') ?? true,
    AgGridUtils.getFlattenColumnsWithoutGroups(ConfigUtils.getParameterAttribute(parameterData, 'columns')),
    options
  );
};

const _generateGridDataFromXLSX = async (fileBlob, parameterData, options) => {
  return await AgGridUtils.fromXLSX(
    fileBlob,
    ConfigUtils.getParameterAttribute(parameterData, 'hasHeader') ?? true,
    AgGridUtils.getFlattenColumnsWithoutGroups(ConfigUtils.getParameterAttribute(parameterData, 'columns')),
    options
  );
};

export const GenericTable = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  resetParameterValue,
  isDirty = false,
}) => {
  const { downloadDatasetPartFileData } = useFileParameters();
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const scenarioId = useCurrentSimulationRunnerId();
  const canChangeRowsNumber = ConfigUtils.getParameterAttribute(parameterData, 'canChangeRowsNumber') ?? false;

  const parameterId = parameterData.id;
  const lockId = `${scenarioId}_${parameterId}`;

  const [isConfirmRowsDeletionDialogOpen, setConfirmRowsDeletionDialogOpen] = useState(false);
  const selectedRowsRef = useRef();

  const [placeholder, setPlaceholder] = useState();

  useEffect(() => {
    if (context.visibilityOptions?.import === false) {
      setPlaceholder({
        title: t('genericcomponent.table.labels.noDataPlaceholderTitle', 'No data'),
        body: t('genericcomponent.table.labels.noDataPlaceholderBody', 'No data to display.'),
      });
    } else if (canChangeRowsNumber) {
      setPlaceholder({
        title: t('genericcomponent.table.labels.addRowPlaceholderTitle', 'Import or create your first data'),
        body: t(
          'genericcomponent.table.labels.addRowPlaceholderBody',
          'Import a valid csv or xlsx file,' +
            'or add a new row, so that your data will be displayed in an interactive table.'
        ),
      });
    } else {
      setPlaceholder({
        title: t('genericcomponent.table.labels.placeholderTitle', 'Import your first data'),
        body: t(
          'genericcomponent.table.labels.placeholderBody',
          'After importing a valid csv or xlsx file, your data will be displayed in an interactive table.'
        ),
      });
    }
  }, [canChangeRowsNumber, context.visibilityOptions?.import, t]);

  const tableLabels = {
    label: t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId),
    loading: t('genericcomponent.table.labels.loading', 'Loading...'),
    clearErrors: t('genericcomponent.table.button.clearErrors', 'Clear'),
    errorsPanelMainError: t('genericcomponent.table.labels.fileImportError', 'File load failed.'),
    placeholderTitle: placeholder?.title,
    placeholderBody: placeholder?.body,
    import: t('genericcomponent.table.labels.import', 'Import'),
    export: t('genericcomponent.table.labels.export', 'Export'),
    addRow: t('genericcomponent.table.labels.addRow', 'Add a new row'),
    deleteRows: t('genericcomponent.table.labels.deleteRows', 'Remove selected rows'),
    fullscreen: t('genericcomponent.table.labels.fullscreen', 'Fullscreen'),
    revert: t('genericcomponent.table.labels.revert', 'Revert'),
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

  const { columns, options } = useMemo(() => {
    const columns = AgGridUtils.getColumnsWithHeaderName(ConfigUtils.getParameterAttribute(parameterData, 'columns'));
    const dateFormat = ConfigUtils.getParameterAttribute(parameterData, 'dateFormat') ?? DEFAULT_DATE_FORMAT;
    return { columns, options: { dateFormat } };
  }, [parameterData]);

  const isUnmount = useRef(false);
  const gridRef = useRef(null);
  useEffect(() => {
    return () => {
      isUnmount.current = true;
      gridRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (GenericTable.downloadLocked != null) GenericTable.downloadLocked[lockId] = false;
    };
  }, [lockId]);

  // Use a ref to keep the most recent data available when serialization is called
  const lastNewParameterValue = useRef(parameterValue ?? {});
  const updateParameterValue = useCallback(
    (newValuePart, shouldReset = false) => {
      const newParameterValue = { ...lastNewParameterValue.current, ...newValuePart };
      lastNewParameterValue.current = newParameterValue;

      // Using a timeout here seems mandatory for react-hook-form to correctly computes the "isDirty" state of the form
      setTimeout(function () {
        if (!isUnmount.current) {
          if (shouldReset) resetParameterValue(newParameterValue);
          else setParameterValue(newParameterValue);
        }
      });
    },
    [resetParameterValue, setParameterValue]
  );

  const updateParameterValueWithReset = useCallback(
    (newValuePart) => {
      updateParameterValue(newValuePart, true);
    },
    [updateParameterValue]
  );

  const setClientFileDescriptorStatuses = (newFileStatus, newDisplayStatus, shouldReset = false) => {
    updateParameterValue({ status: newFileStatus, displayStatus: newDisplayStatus }, shouldReset);
  };

  const setClientFileDescriptorStatusesWithReset = (newFileStatus, newDisplayStatus) => {
    setClientFileDescriptorStatuses(newFileStatus, newDisplayStatus, true);
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

  const isDataFetchedFromDataset = !!ConfigUtils.getParameterAttribute(parameterData, 'dynamicValues');

  const _getDataFromDatasetPart = async (setClientFileDescriptor, currentParameterValue) => {
    if (_checkForLock()) return;
    GenericTable.downloadLocked[lockId] = true;

    const fileName = `${parameterData.id}.csv`;
    const noFileDescriptor = { value: null, serializedData: null, displayData: null, errors: null };
    const _setErrorStatusAndFreeLock = () => {
      GenericTable.downloadLocked[lockId] = false;

      // If the current status was already an error, add a short timeout to maintain the loading status and give visual
      // feedback to users
      const timeoutDelayInMs = currentParameterValue?.displayStatus === TABLE_DATA_STATUS.ERROR ? 100 : null;
      if (!timeoutDelayInMs) setClientFileDescriptor({ ...noFileDescriptor, displayStatus: TABLE_DATA_STATUS.ERROR });
      else {
        setTimeout(function () {
          setClientFileDescriptor({ ...noFileDescriptor, displayStatus: TABLE_DATA_STATUS.ERROR });
        }, timeoutDelayInMs);
      }
    };

    setClientFileDescriptor({ ...noFileDescriptor, displayStatus: TABLE_DATA_STATUS.DOWNLOADING });
    const sourceDataset = context.targetDataset;
    if (!sourceDataset) {
      setPlaceholder({
        title: t('commoncomponents.banner.missingDataset', 'Dataset not found'),
        body: t(
          'genericcomponent.table.labels.datasetNotFoundError',
          'Impossible to fetch data from dataset because it does not exist or you do not have access to it. '
        ),
      });
      _setErrorStatusAndFreeLock();
      return;
    }

    if (!DatasetsUtils.hasDBDatasetParts(sourceDataset)) {
      setPlaceholder({
        title: t('genericcomponent.table.labels.datasetErrorTitle', 'Dataset error'),
        body: t(
          'genericcomponent.table.labels.noDbPartInDatasetErrorMessage',
          'Only datasets with parts of type "DB" can be used to fetch table data dynamically'
        ),
      });
      _setErrorStatusAndFreeLock();
      return;
    }

    const dynamicValuesAttr = ConfigUtils.getParameterAttribute(parameterData, 'dynamicValues') || {};
    const datasetPartName = dynamicValuesAttr.datasetPartName;
    const queryOptions = dynamicValuesAttr.options ?? {};
    const datasetPart = (sourceDataset.parts ?? []).find((part) => part.name === datasetPartName && part.type === 'DB');
    if (datasetPart == null) {
      setPlaceholder({
        title: t('genericcomponent.table.labels.datasetErrorTitle', 'Dataset error'),
        body: t(
          'genericcomponent.table.labels.dbPartNotFoundErrorMessage',
          'No dataset part with name "{{datasetPartName}}" found in dataset "{{datasetName}}"',
          { datasetName: sourceDataset?.name, datasetPartName }
        ),
      });
      _setErrorStatusAndFreeLock();
      return;
    }

    let data;
    try {
      data = await DatasetService.queryDatasetPart(datasetPart, queryOptions);
    } catch (error) {
      setPlaceholder({
        title: error?.response?.statusText ?? t('genericcomponent.table.labels.queryFailedError', 'Query failed'),
        body: t(
          'genericcomponent.table.labels.unknownQueryError',
          'Something went wrong when querying the table data. Please contact your administrator if the ' +
            'problem persists.'
        ),
      });
      console.error(error?.response?.data?.detail);
      _setErrorStatusAndFreeLock();
      return;
    }

    if (data.length === 0) {
      setPlaceholder({
        title: t('genericcomponent.table.labels.noDataPlaceholderTitle', 'No data'),
        body: t(
          'genericcomponent.table.labels.wrongQueryError',
          'Returned result is empty, there is probably an error in your query configuration. ' +
            'Please, check your solution'
        ),
      });
      _setErrorStatusAndFreeLock();
      return;
    }

    const agGridData = parseCSVFromAPIResponse(data, columns, options);
    if (agGridData.error) {
      setClientFileDescriptor({
        displayStatus: TABLE_DATA_STATUS.ERROR,
        errors: agGridData.error,
      });
    } else {
      setClientFileDescriptor({
        name: fileName,
        value: null,
        displayData: agGridData.rows,
        errors: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        displayStatus: TABLE_DATA_STATUS.READY,
        serialize: serializeToCSV,
      });
    }

    GenericTable.downloadLocked[lockId] = false;
  };

  const _downloadDatasetFileContentFromStorage = async (
    organizationId,
    workspaceId,
    clientFileDescriptor,
    setClientFileDescriptor
  ) => {
    // Setting the table status to DOWNLOADING again even when the download is already active (and thus locked) seems
    // to fix a race condition in the table parameter state. This can be used to fix the missing loading spinner.
    setClientFileDescriptor({
      value: null,
      serializedData: null,
      displayData: null,
      errors: null,
      status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
      displayStatus: TABLE_DATA_STATUS.DOWNLOADING,
    });

    if (_checkForLock()) return;
    GenericTable.downloadLocked[lockId] = true;

    const data = await downloadDatasetPartFileData(clientFileDescriptor, setClientFileDescriptorStatusesWithReset);

    if (data) {
      const fileName = clientFileDescriptor.name;
      const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD;
      _parseCSVFileContent(data, fileName, clientFileDescriptor, setClientFileDescriptor, finalStatus);
    } else {
      setClientFileDescriptor({
        value: null,
        serializedData: null,
        errors: null,
        displayData: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
        displayStatus: TABLE_DATA_STATUS.ERROR,
      });
    }
    GenericTable.downloadLocked[lockId] = false;
  };

  const serializeToCSV = useCallback(() => {
    const newFileContent = AgGridUtils.toCSV(lastNewParameterValue.current.displayData, columns, options);
    updateParameterValue({ serializedData: newFileContent });
    gridRef.current?.api?.stopEditing();
    return newFileContent;
  }, [columns, options, updateParameterValue]);

  const _parseCSVFileContent = useCallback(
    (
      fileContent,
      fileName,
      clientFileDescriptor,
      setClientFileDescriptor,
      finalStatus,
      clientFileDescriptorRestoreValue
    ) => {
      setClientFileDescriptor({
        name: fileName,
        value: null,
        displayData: null,
        errors: null,
        serializedData: fileContent,
        status: finalStatus,
        displayStatus: TABLE_DATA_STATUS.PARSING,
      });

      const agGridData = _generateGridDataFromCSV(fileContent, parameterData, options);
      if (agGridData.error) {
        if (clientFileDescriptorRestoreValue && clientFileDescriptorRestoreValue.status !== 'EMPTY') {
          setClientFileDescriptor({
            ...clientFileDescriptorRestoreValue,
            errors: agGridData.error,
            displayStatus: clientFileDescriptorRestoreValue?.displayStatus ?? TABLE_DATA_STATUS.READY,
          });
        } else {
          setClientFileDescriptor({ displayStatus: TABLE_DATA_STATUS.ERROR, errors: agGridData.error });
        }
      } else {
        setClientFileDescriptor({
          name: fileName,
          value: null,
          displayData: agGridData.rows,
          errors: agGridData.error,
          serializedData: fileContent,
          status: finalStatus,
          displayStatus: TABLE_DATA_STATUS.READY,
          serialize: serializeToCSV,
        });
      }
    },
    [options, parameterData, serializeToCSV]
  );

  const _readAndParseCSVFile = useCallback(
    (file, clientFileDescriptor, setClientFileDescriptor, clientFileDescriptorRestoreValue) => {
      if (!file) {
        return;
      }
      const fileName = lastNewParameterValue.current?.name ?? '';
      setClientFileDescriptor({
        name: fileName,
        value: null,
        serializedData: null,
        displayData: null,
        errors: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        displayStatus: TABLE_DATA_STATUS.UPLOADING,
      });
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileContent = event.target.result;
        const finalStatus = UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD;
        _parseCSVFileContent(
          fileContent,
          fileName,
          clientFileDescriptor,
          setClientFileDescriptor,
          finalStatus,
          clientFileDescriptorRestoreValue
        );
      };

      reader.readAsText(file);
    },
    [_parseCSVFileContent]
  );

  const _readAndParseXLSXFile = useCallback(
    async (file, clientFileDescriptor, setClientFileDescriptor, clientFileDescriptorRestoreValue) => {
      if (!file) return;

      let fileName = lastNewParameterValue.current?.name ?? '';
      if (fileName.endsWith('.xlsx')) fileName = fileName.replace(/.xlsx$/, '.csv');

      setClientFileDescriptor({
        name: fileName,
        file,
        serializedData: null,
        displayData: null,
        errors: null,
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        displayStatus: TABLE_DATA_STATUS.PARSING,
      });

      const agGridData = await _generateGridDataFromXLSX(file, parameterData, options);
      if (agGridData.error) {
        if (clientFileDescriptorRestoreValue && clientFileDescriptorRestoreValue.status !== 'EMPTY') {
          setClientFileDescriptor({
            ...clientFileDescriptorRestoreValue,
            errors: agGridData.error,
          });
        } else {
          setClientFileDescriptor({
            errors: agGridData.error,
            displayStatus: TABLE_DATA_STATUS.ERROR,
          });
        }
      } else {
        const newFileContent = AgGridUtils.toCSV(
          agGridData.rows,
          ConfigUtils.getParameterAttribute(parameterData, 'columns'),
          options
        );
        setClientFileDescriptor({
          name: fileName,
          value: null,
          serializedData: newFileContent,
          displayData: agGridData.rows,
          errors: agGridData.error,
          status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
          displayStatus: TABLE_DATA_STATUS.READY,
          serialize: serializeToCSV,
        });
      }
    },
    [options, parameterData, serializeToCSV]
  );

  const importFile = useCallback(
    (event) => {
      // TODO: ask confirmation if data already exist
      const previousFileBackup = clone(parameterValue);
      const options = { defaultFileTypeFilter: '.csv, .xlsx' };
      const file = FileManagementUtils.prepareToUpload(event, updateParameterValue, parameterData, options);
      if (file.name.endsWith('.csv')) {
        _readAndParseCSVFile(file, parameterValue, updateParameterValue, previousFileBackup);
      } else if (file.name.endsWith('.xlsx')) {
        _readAndParseXLSXFile(file, parameterValue, updateParameterValue, previousFileBackup);
      } else {
        updateParameterValue({
          errors: [{ summary: 'Unknown file type, please provide a CSV or XLSX file.', loc: file.name }],
        });
      }
    },
    [_readAndParseCSVFile, _readAndParseXLSXFile, parameterValue, updateParameterValue, parameterData]
  );

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const openExportDialog = () => setIsExportDialogOpen(true);
  const closeExportDialog = () => setIsExportDialogOpen(false);
  const [isRevertDialogOpen, setIsRevertDialogOpen] = useState(false);
  const closeRevertDialog = () => setIsRevertDialogOpen(false);
  const exportCSV = useCallback(
    (fileName) => {
      const fileContent = AgGridUtils.toCSV(lastNewParameterValue.current.displayData, columns, options);
      FileBlobUtils.downloadFileFromData(fileContent, fileName);
    },
    [columns, options]
  );
  const exportXSLX = useCallback(
    (fileName) => {
      const fileContent = AgGridUtils.toXLSX(lastNewParameterValue.current.displayData, columns, options);
      FileBlobUtils.downloadFileFromData(fileContent, fileName);
    },
    [columns, options]
  );
  const exportFile = useCallback(
    (fileName) => {
      if (fileName.toLowerCase().endsWith('.xlsx')) exportXSLX(fileName);
      else exportCSV(fileName);
    },
    [exportCSV, exportXSLX]
  );
  const exportTable = useCallback(
    (fileName) => {
      closeExportDialog();
      exportFile(fileName);
    },
    [exportFile]
  );

  const updateOnFirstEdition = useCallback(() => {
    if (!lastNewParameterValue.current.serialize || !isDirty) {
      updateParameterValue({
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        displayStatus: TABLE_DATA_STATUS.READY,
        errors: null,
        serialize: serializeToCSV,
      });
    }
  }, [isDirty, serializeToCSV, updateParameterValue]);

  const onClearErrors = () => updateParameterValue({ errors: null });

  const buildErrorsPanelTitle = (errorsCount, maxErrorsCount) => {
    let title = t('genericcomponent.table.labels.errorsCount', '{{count}} errors occurred:', { count: errorsCount });
    if (errorsCount > maxErrorsCount) {
      const errorLimitMessage = t(
        'genericcomponent.table.labels.maxErrorsCount',
        '(only the top first {{maxCount}} results)',
        { maxCount: maxErrorsCount }
      );
      title += ' ' + errorLimitMessage;
    }
    return title;
  };

  // Trigger dataset download only when mounting the component
  useEffect(() => {
    const alreadyDownloaded =
      parameterValue?.displayStatus !== undefined &&
      [
        TABLE_DATA_STATUS.ERROR,
        TABLE_DATA_STATUS.DOWNLOADING,
        TABLE_DATA_STATUS.PARSING,
        TABLE_DATA_STATUS.READY,
      ].includes(parameterValue?.displayStatus);

    if (
      parameterValue?.datasetId &&
      parameterValue?.datasetPartId &&
      !parameterValue?.serializedData &&
      parameterValue?.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD &&
      !alreadyDownloaded
    ) {
      _downloadDatasetFileContentFromStorage(
        organizationId,
        workspaceId,
        parameterValue,
        updateParameterValueWithReset
      );
    } else if (
      isDataFetchedFromDataset &&
      !parameterValue?.serializedData &&
      parameterValue?.status === UPLOAD_FILE_STATUS_KEY.EMPTY &&
      !alreadyDownloaded
    ) {
      _getDataFromDatasetPart(updateParameterValueWithReset, parameterValue);
    }
  });

  const onCellChange = useCallback(() => {
    updateParameterValue({ displayData: clone(parameterValue?.displayData ?? []) });
    updateOnFirstEdition();
  }, [parameterValue?.displayData, updateParameterValue, updateOnFirstEdition]);

  const onAddRow = useCallback(() => {
    const newLine = TableUtils.createNewTableLine(
      ConfigUtils.getParameterAttribute(parameterData, 'columns'),
      ConfigUtils.getParameterAttribute(parameterData, 'dateFormat')
    );
    const rowsCountBeforeRowAddition = lastNewParameterValue.current?.displayData?.length ?? 0;
    if (rowsCountBeforeRowAddition === 0) {
      updateParameterValue({ displayData: [newLine], name: parameterValue?.file?.name ?? `${parameterData.id}.csv` });
      updateOnFirstEdition();
      return;
    }

    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const getRowNodeIndex = (rowNode) => {
      const index = rowNode?.childIndex ?? parseInt(rowNode?.id);
      return isNaN(index) ? -1 : index;
    };

    const isSortEnabled = gridApi.getColumnState().find((column) => column.sort !== null) !== undefined;
    const selectedLines = gridApi.getSelectedNodes() ?? [];
    const lastSelectedLine = selectedLines[selectedLines.length - 1];

    let addIndexForTransaction = rowsCountBeforeRowAddition;
    let addIndex = rowsCountBeforeRowAddition;
    if (!isSortEnabled) {
      addIndexForTransaction = selectedLines.length > 0 ? lastSelectedLine.rowIndex + 1 : 0;
      addIndex = selectedLines.length > 0 ? getRowNodeIndex(lastSelectedLine) + 1 : 0;
    }

    const newDisplayData = clone(parameterValue?.displayData ?? []);
    if (isSortEnabled) newDisplayData.push(newLine);
    else if (selectedLines?.length > 0) newDisplayData.splice(addIndex, 0, newLine);
    else newDisplayData.unshift(newLine);
    updateParameterValue({ displayData: newDisplayData });

    gridApi.applyTransaction({ add: [newLine], addIndex: addIndexForTransaction });
    gridApi.deselectAll();
    updateOnFirstEdition();
  }, [
    updateOnFirstEdition,
    parameterValue?.displayData,
    parameterValue?.file?.name,
    parameterData,
    updateParameterValue,
  ]);

  const deleteRow = useCallback(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const nodesDataToRemove = gridApi.getSelectedNodes().map((rowNode) => rowNode.data);
    gridApi.applyTransaction({ remove: nodesDataToRemove });

    const newDisplayData = clone(lastNewParameterValue.current?.displayData ?? []);
    const _findRowIndexFromData = (nodeData) => newDisplayData.findIndex((row) => equal(row, nodeData));
    nodesDataToRemove.forEach((nodeDataToRemove) => {
      const rowIndexToRemove = _findRowIndexFromData(nodeDataToRemove);
      newDisplayData.splice(rowIndexToRemove, 1);
    });

    updateParameterValue({ displayData: newDisplayData });
    updateOnFirstEdition();
  }, [updateOnFirstEdition, updateParameterValue]);

  const onDeleteRow = useCallback(() => {
    const selectedRows = gridRef.current?.api?.getSelectedNodes() ?? [];
    selectedRowsRef.current = selectedRows;
    if (selectedRows.length > 1 && localStorage.getItem('dontAskAgainToDeleteRow') !== 'true') {
      setConfirmRowsDeletionDialogOpen(true);
    } else deleteRow();
  }, [deleteRow]);

  const revertTableWithDatasetData = useCallback(
    (isChecked) => {
      localStorage.setItem('dontAskAgainToRevertTableData', JSON.stringify(isChecked));
      closeRevertDialog();
      // To trigger isDirty state when an already saved table was reverted and avoid it in other cases, we need to
      // updateParameterValue setter and updateOnFirstEdition function that triggers the start of edition; on the other
      // hand, updateParameterValueWithReset setter rollbacks modified values without triggering isDirty
      if (parameterValue?.serializedData != null) {
        _getDataFromDatasetPart(updateParameterValue, parameterValue);
        updateOnFirstEdition();
      } else _getDataFromDatasetPart(updateParameterValueWithReset, parameterValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parameterValue?.serializedData, updateParameterValue, updateParameterValueWithReset, updateOnFirstEdition]
  );

  const onRevertTableData = useCallback(() => {
    if (localStorage.getItem('dontAskAgainToRevertTableData') !== 'true') setIsRevertDialogOpen(true);
    else revertTableWithDatasetData(true);
  }, [setIsRevertDialogOpen, revertTableWithDatasetData]);

  const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required') ?? false;
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
        id={`table-${parameterData.id}`}
        gridRef={gridRef}
        labels={tableLabels}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        dateFormat={options.dateFormat}
        editMode={context.editMode}
        dataStatus={parameterValue?.displayStatus || TABLE_DATA_STATUS.EMPTY}
        errors={parameterValue?.errors}
        columns={columns}
        rows={parameterValue?.displayData ?? []}
        agTheme={context.isDarkTheme ? gridDark.agTheme : gridLight.agTheme}
        onImport={importFile}
        onExport={openExportDialog}
        onAddRow={canChangeRowsNumber ? onAddRow : null}
        onDeleteRow={canChangeRowsNumber ? onDeleteRow : null}
        onRevert={isDataFetchedFromDataset ? onRevertTableData : null}
        onCellChange={onCellChange}
        onClearErrors={onClearErrors}
        buildErrorsPanelTitle={buildErrorsPanelTitle}
        maxErrorsCount={MAX_ERRORS_COUNT}
        isDirty={isDirty}
        visibilityOptions={context.tableOptions?.buttons}
        required={isRequired}
        height={context.tableOptions?.height ?? '258px'}
      />
      <TableDeleteRowsDialog
        open={isConfirmRowsDeletionDialogOpen}
        onClose={() => setConfirmRowsDeletionDialogOpen(false)}
        onConfirm={(isChecked) => {
          setConfirmRowsDeletionDialogOpen(false);
          localStorage.setItem('dontAskAgainToDeleteRow', isChecked);
          deleteRow();
        }}
        selectedRowsCount={selectedRowsRef.current?.length ?? 0}
      />
      <TableRevertDataDialog
        onClose={closeRevertDialog}
        onConfirm={revertTableWithDatasetData}
        open={isRevertDialogOpen}
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

GenericTable.useValidationRules = (parameterData, isDatasetManagerView) => {
  const { t } = useTranslation();
  const requiredValueFromConfig = ConfigUtils.getParameterAttribute(parameterData, 'required');
  const isRequired = requiredValueFromConfig === true || (isDatasetManagerView && requiredValueFromConfig !== false);

  return {
    required: {
      value: isRequired,
      message: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    },
    validate: {
      required: (parameterValue) => {
        if (!isRequired) return true;
        return (
          parameterValue?.status !== UPLOAD_FILE_STATUS_KEY.EMPTY && (parameterValue?.displayData ?? []).length !== 0
        );
      },
    },
  };
};
