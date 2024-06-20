// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import { AgGridUtils, FileBlobUtils } from '@cosmotech/core';
import { Table, TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { Api } from '../../../../services/config/Api';
import applicationStore from '../../../../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../../../../state/dispatchers/app/ApplicationDispatcher';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { useCurrentScenarioData } from '../../../../state/hooks/ScenarioHooks';
import { useWorkspaceId } from '../../../../state/hooks/WorkspaceHooks.js';
import { gridLight, gridDark } from '../../../../theme/';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { FileManagementUtils } from '../../../../utils/FileManagementUtils';
import { TableUtils } from '../../../../utils/TableUtils';
import { TableExportDialog } from './components';
import { TableDeleteRowsDialog } from './components/TableDeleteRowsDialog';

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const MAX_ERRORS_COUNT = 100;

const _generateGridDataFromCSV = (fileContent, parameterData, options) => {
  return AgGridUtils.fromCSV(
    fileContent,
    ConfigUtils.getParameterAttribute(parameterData, 'hasHeader') || true,
    AgGridUtils.getFlattenColumnsWithoutGroups(ConfigUtils.getParameterAttribute(parameterData, 'columns')),
    options
  );
};

export const CypherTable = ({
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
  const currentScenario = useCurrentScenarioData();
  const canChangeRowsNumber = ConfigUtils.getParameterAttribute(parameterData, 'canChangeRowsNumber') ?? false;

  const parameterId = parameterData.id;
  const [parameter, setParameter] = useState(parameterValue || {});

  const lockId = `${scenarioId}_${parameterId}`;

  const [isConfirmRowsDeletionDialogOpen, setConfirmRowsDeletionDialogOpen] = useState(false);
  const selectedRowsRef = useRef();

  const tableLabels = {
    label: t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId),
    loading: t('genericcomponent.table.labels.loading', 'Loading...'),
    clearErrors: t('genericcomponent.table.button.clearErrors', 'Clear'),
    errorsPanelMainError: t('genericcomponent.table.labels.fileImportError', 'File load failed.'),
    placeholderTitle: canChangeRowsNumber
      ? t('genericcomponent.table.labels.addRowPlaceholderTitle', 'Import or create your first data')
      : t('genericcomponent.table.labels.placeholderTitle', 'Import your first data'),
    placeholderBody: canChangeRowsNumber
      ? t(
          'genericcomponent.table.labels.addRowPlaceholderBody',
          'Import a valid csv or xlsx file,' +
            'or add a new row, so that your data will be displayed in an interactive table.'
        )
      : t(
          'genericcomponent.table.labels.placeholderBody',
          'After importing a valid csv or xlsx file, your data will be displayed in an interactive table.'
        ),
    import: t('genericcomponent.table.labels.import', 'Import'),
    export: t('genericcomponent.table.labels.export', 'Export'),
    addRow: t('genericcomponent.table.labels.addRow', 'Add a new row'),
    deleteRows: t('genericcomponent.table.labels.deleteRows', 'Remove selected rows'),
    fullscreen: t('genericcomponent.table.labels.fullscreen', 'Fullscreen'),
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

  const columns = AgGridUtils.getColumnsWithHeaderName(ConfigUtils.getParameterAttribute(parameterData, 'columns'));
  const dateFormat = ConfigUtils.getParameterAttribute(parameterData, 'dateFormat') || DEFAULT_DATE_FORMAT;
  const options = useMemo(() => {
    return { dateFormat };
  }, [dateFormat]);

  const isUnmount = useRef(false);
  const gridRef = useRef(null);
  useEffect(() => {
    return () => {
      isUnmount.current = true;
      gridRef.current = null;
    };
  }, []);

  // Store last parameter in a ref
  // Update a state is async, so, in case of multiple call of updateParameterValue in same function
  // parameter state value will be updated only in last call.
  // We need here to use a ref value for be sure to have the good value.
  const lastNewParameterValue = useRef(parameter);
  const updateParameterValue = useCallback(
    (newValuePart, shouldReset = false) => {
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
    },
    [resetParameterValue, setParameterValue]
  );

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
    if (CypherTable.downloadLocked === undefined) {
      CypherTable.downloadLocked = {};
    } else if (lockId in CypherTable.downloadLocked === false) {
      CypherTable.downloadLocked[lockId] = false;
    } else if (CypherTable.downloadLocked[lockId]) {
      return true;
    }
    return false;
  };
  // NEW ==========================================================================================
  const _convertJsonToCsv = (header, rows) => {
    return [header.join(','), ...rows.map((row) => header.map((field) => JSON.stringify(row[field])).join(','))].join(
      '\n'
    );
  };
  const _getDataFromCypherQuery = async (setClientFileDescriptor) => {
    const source = ConfigUtils.getParameterAttribute(parameterData, 'source');
    const query = source?.query;
    const sourceDatasetId = currentScenario?.datasetList[0];
    setClientFileDescriptor({
      file: null,
      content: null,
      agGridRows: null,
      errors: null,
      tableDataStatus: TABLE_DATA_STATUS.DOWNLOADING,
    });
    if (_checkForLock()) {
      return;
    }
    CypherTable.downloadLocked[lockId] = true;
    try {
      const { data } = await Api.Datasets.twingraphQuery(organizationId, sourceDatasetId, { query });
      const jsonRows = data.map((row) => row.fields);
      const header = columns.map((column) => column.field);
      const csvRows = _convertJsonToCsv(header, jsonRows);
      const agGridData = _generateGridDataFromCSV(csvRows, parameterData);
      if (agGridData.error) {
        setClientFileDescriptor({
          tableDataStatus: TABLE_DATA_STATUS.ERROR,
          errors: agGridData.error,
        });
      } else
        setClientFileDescriptor({
          name: parameterData.id,
          file: null,
          content: null,
          agGridRows: agGridData.rows,
          errors: null,
          status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
          tableDataStatus: TABLE_DATA_STATUS.READY,
        });
    } catch (error) {
      applicationStore.dispatch(
        dispatchSetApplicationErrorMessage(error, 'Please use a twingraph dataset to load data')
      );
      setClientFileDescriptor({
        file: null,
        content: null,
        agGridRows: null,
        errors: null,
        tableDataStatus: TABLE_DATA_STATUS.ERROR,
      });
    }

    CypherTable.downloadLocked[lockId] = false;
  };

  // =============================================================================
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
    CypherTable.downloadLocked[lockId] = true;
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
    CypherTable.downloadLocked[lockId] = false;
  };

  const _uploadPreprocess = useCallback(() => {
    const newFileContent = AgGridUtils.toCSV(lastNewParameterValue.current.agGridRows, columns, options);
    updateParameterValue({ content: newFileContent });
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
        file: null,
        agGridRows: null,
        errors: null,
        content: fileContent,
        status: finalStatus,
        tableDataStatus: TABLE_DATA_STATUS.PARSING,
      });

      const agGridData = _generateGridDataFromCSV(fileContent, parameterData, options);
      if (agGridData.error) {
        if (clientFileDescriptorRestoreValue && clientFileDescriptorRestoreValue.status !== 'EMPTY') {
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
          uploadPreprocess: { content: _uploadPreprocess },
        });
      }
    },
    [options, parameterData, _uploadPreprocess]
  );

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const openExportDialog = () => setIsExportDialogOpen(true);
  const closeExportDialog = () => setIsExportDialogOpen(false);
  const exportCSV = useCallback(
    (fileName) => {
      const fileContent = AgGridUtils.toCSV(parameter.agGridRows, columns, options);
      FileBlobUtils.downloadFileFromData(fileContent, fileName);
    },
    [columns, options, parameter.agGridRows]
  );
  const exportXSLX = useCallback(
    (fileName) => {
      const fileContent = AgGridUtils.toXLSX(parameter.agGridRows, columns, options);
      FileBlobUtils.downloadFileFromData(fileContent, fileName);
    },
    [columns, options, parameter.agGridRows]
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
    if (!parameter.uploadPreprocess || !isDirty) {
      updateParameterValue({
        status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
        tableDataStatus: TABLE_DATA_STATUS.READY,
        errors: null,
        uploadPreprocess: { content: _uploadPreprocess },
      });
    }
  }, [parameter.uploadPreprocess, isDirty, _uploadPreprocess, updateParameterValue]);

  const onCellChange = updateOnFirstEdition;

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
    } else if (!parameter.content && parameter.status === UPLOAD_FILE_STATUS_KEY.EMPTY && !alreadyDownloaded) {
      _getDataFromCypherQuery(updateParameterValueWithReset);
    }
  });

  const onAddRow = useCallback(() => {
    const newLine = TableUtils.createNewTableLine(parameterData.options.columns, parameterData.options.dateFormat);
    const rowsCountBeforeRowAddition = parameter?.agGridRows?.length ?? 0;
    if (rowsCountBeforeRowAddition === 0) {
      updateParameterValue({ agGridRows: [newLine], name: parameter?.file?.name ?? `${parameterData.id}.csv` });
      updateOnFirstEdition();
      return;
    }

    const gridApi = gridRef.current?.api;
    const columnApi = gridRef.current?.columnApi;
    if (!gridApi || !columnApi) return;

    const getRowNodeIndex = (rowNode) => {
      const index = rowNode?.childIndex ?? parseInt(rowNode?.id);
      return isNaN(index) ? -1 : index;
    };

    const isSortEnabled = columnApi.getColumnState().find((column) => column.sort !== null) !== undefined;
    const selectedLines = gridApi.getSelectedNodes() ?? [];
    const lastSelectedLine = selectedLines[selectedLines.length - 1];

    let addIndexForTransaction = rowsCountBeforeRowAddition;
    let addIndex = rowsCountBeforeRowAddition;
    if (!isSortEnabled) {
      addIndexForTransaction = selectedLines.length > 0 ? lastSelectedLine.rowIndex + 1 : 0;
      addIndex = selectedLines.length > 0 ? getRowNodeIndex(lastSelectedLine) + 1 : 0;
    }

    if (isSortEnabled) {
      parameter.agGridRows.push(newLine);
    } else if (selectedLines?.length > 0) {
      parameter.agGridRows.splice(addIndex, 0, newLine);
    } else {
      parameter.agGridRows.unshift(newLine);
    }

    gridApi.applyTransaction({ add: [newLine], addIndex: addIndexForTransaction });
    gridApi.deselectAll();
    updateOnFirstEdition();
  }, [
    updateOnFirstEdition,
    parameter.agGridRows,
    parameter.file?.name,
    parameterData.id,
    parameterData.options.columns,
    parameterData.options.dateFormat,
    updateParameterValue,
  ]);

  const deleteRow = useCallback(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    const nodesDataToRemove = gridApi.getSelectedNodes().map((rowNode) => rowNode.data);
    gridApi.applyTransaction({ remove: nodesDataToRemove });

    const _findRowIndexFromData = (nodeData) => parameter.agGridRows.findIndex((row) => row === nodeData);
    nodesDataToRemove.forEach((nodeDataToRemove) => {
      const rowIndexToRemove = _findRowIndexFromData(nodeDataToRemove);
      parameter.agGridRows.splice(rowIndexToRemove, 1);
    });

    if (parameter.agGridRows.length === 0) {
      updateParameterValue({ agGridRows: parameter.agGridRows });
    }

    updateOnFirstEdition();
  }, [updateOnFirstEdition, parameter.agGridRows, updateParameterValue]);

  const onDeleteRow = useCallback(() => {
    const selectedRows = gridRef.current?.api?.getSelectedNodes() ?? [];
    selectedRowsRef.current = selectedRows;
    if (selectedRows.length > 1 && localStorage.getItem('dontAskAgainToDeleteRow') !== 'true') {
      setConfirmRowsDeletionDialogOpen(true);
    } else deleteRow();
  }, [deleteRow]);
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
        dateFormat={dateFormat}
        editMode={context.editMode}
        dataStatus={parameter.tableDataStatus || TABLE_DATA_STATUS.EMPTY}
        errors={parameter.errors}
        columns={columns}
        rows={parameter.agGridRows || []}
        agTheme={context.isDarkTheme ? gridDark.agTheme : gridLight.agTheme}
        onExport={openExportDialog}
        onAddRow={canChangeRowsNumber ? onAddRow : null}
        onDeleteRow={canChangeRowsNumber ? onDeleteRow : null}
        onCellChange={onCellChange}
        onClearErrors={onClearErrors}
        buildErrorsPanelTitle={buildErrorsPanelTitle}
        maxErrorsCount={MAX_ERRORS_COUNT}
        isDirty={isDirty}
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
    </>
  );
};

CypherTable.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  resetParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
CypherTable.defaultProps = {
  isDirty: false,
};
