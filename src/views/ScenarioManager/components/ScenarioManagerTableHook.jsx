// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridCellCheckboxRenderer } from '@mui/x-data-grid';
import rfdc from 'rfdc';
import { ResourceUtils } from '@cosmotech/core';
import { FadingTooltip, ScenarioValidationStatusChip } from '@cosmotech/ui';
import { useHasUserPermissionOnScenario } from '../../../hooks/SecurityHooks';
import { ACL_PERMISSIONS } from '../../../services/config/accessControl';
import { useFindDatasetById } from '../../../state/datasets/hooks';
import { useGetTranslatedRunnerLastRunStatus, useRunners } from '../../../state/runner/hooks';
import { TranslationUtils } from '../../../utils';
import { ScenarioInfoTooltip } from './ScenarioInfoTooltip';
import { ScenarioRunStatusCell } from './ScenarioRunStatusCell';
import { ScenarioTableRowMenuButton } from './ScenarioTableRowMenuButton';

const clone = rfdc();

const SEARCH_FIELD_DEBOUNCE_DELAY_MS = 100;
const NBSP = '\xa0'; // Non-breaking space

const forgeColumns = (t, validationStatusLabels) => [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderCell: (params) => {
      if (params.row.canBeDeleted) return <GridCellCheckboxRenderer {...params} />;
      return (
        <FadingTooltip
          title={t(
            'commoncomponents.scenariomanager.table.rowAction.cannotDeleteTooltip',
            'You do not have the required permissions to delete this scenario'
          )}
          disableInteractive
        >
          <GridCellCheckboxRenderer {...params} />
        </FadingTooltip>
      );
    },
  },
  {
    field: 'name',
    headerName: t('commoncomponents.scenariomanager.table.column.scenario', 'Scenario'),
    valueGetter: (_, row) => row.name ?? 'N/A',
    renderCell: (params) => {
      const scenarioName = params.value;
      const nameWithOffset = `${NBSP.repeat(4 * (params.row.depth ?? 0))}${scenarioName}`;
      return (
        <Stack direction="row" sx={{ alignItems: 'center', height: '100%' }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={scenarioName}>
            {nameWithOffset}
          </span>
          <ScenarioInfoTooltip scenario={params.row} />
        </Stack>
      );
    },
    minWidth: 250,
    flex: 3,
  },
  {
    field: 'runType',
    headerName: t('commoncomponents.scenariomanager.table.column.runType', 'Run Type'),
    valueGetter: (_, row) => row.runTemplateName,
    minWidth: 200,
    flex: 2,
  },
  {
    field: 'runStatus',
    headerName: t('commoncomponents.scenariomanager.table.column.runStatus', 'Run Status'),
    renderCell: (params) => <ScenarioRunStatusCell scenario={params.row} />,
    minWidth: 100,
    flex: 1,
  },
  {
    field: 'dataset',
    headerName: t('commoncomponents.scenariomanager.table.column.dataset', 'Dataset'),
    valueGetter: (_, row) => row.datasetName,
    minWidth: 200,
    flex: 2,
  },
  {
    field: 'owner',
    headerName: t('commoncomponents.scenariomanager.table.column.owner', 'Owner'),
    valueGetter: (_, row) => row.ownerName ?? 'N/A',
    minWidth: 100,
    flex: 1,
  },
  {
    field: 'created',
    headerName: t('commoncomponents.scenariomanager.table.column.created', 'Created'),
    valueGetter: (_, row) => row.formattedCreationDate ?? 'N/A',
    minWidth: 100,
    flex: 1,
  },
  {
    field: 'status',
    headerName: t('commoncomponents.scenariomanager.table.column.status', 'Status'),
    valueGetter: (_, row) => row.validationStatus,
    renderCell: (params) => (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <ScenarioValidationStatusChip showDraft status={params.value} labels={validationStatusLabels} />
      </div>
    ),
    minWidth: 100,
    flex: 0.5,
  },
  {
    field: 'actionMenu',
    headerName: '',
    renderCell: (params) => (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <ScenarioTableRowMenuButton scenario={params.row} />
      </div>
    ),
    minWidth: 60,
    maxWidth: 60,
    flex: 1,
    align: 'center',
    disableColumnMenu: true,
  },
];

const matchScenarioField = (scenario, field, value = '') =>
  (scenario?.[field] ?? '').trim().toLowerCase().includes(value.trim().toLowerCase());
const applyScenarioFilter = (scenarios = [], filter) => {
  if (!filter) return scenarios;
  const fieldsToSearch = [
    'name',
    'description',
    'runTemplateName',
    'datasetName',
    'ownerName',
    'translatedValidationStatus',
    'translatedRunStatus',
    // Do not filter on creation date (formattedCreationDate), numbers would trigger too many false positives
  ];

  return scenarios.filter((scenario) => {
    for (const field of fieldsToSearch) {
      if (matchScenarioField(scenario, field, filter)) return true;
    }
    for (const tag of scenario?.tags ?? []) {
      if (tag.trim().toLowerCase().includes(filter.trim().toLowerCase())) return true;
    }
    if (scenario.id === filter.trim().toLowerCase()) return true; // Exact match only for id
    return false;
  });
};

export const useScenarioManagerTable = () => {
  const { t } = useTranslation();
  const getTranslatedRunnerLastRunStatus = useGetTranslatedRunnerLastRunStatus();
  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const findDatasetById = useFindDatasetById();
  const runners = useRunners(); // Actually only simulation runners

  const [isSearchPending, setIsSearchPending] = useState(false);
  const [searchFieldValue, setSearchFieldValue] = useState();

  const validationStatusLabels = useMemo(
    () => ({
      draft: t('views.scenario.validation.draft', 'Draft'),
      rejected: t('views.scenario.validation.rejected', 'Rejected'),
      validated: t('views.scenario.validation.validated', 'Validated'),
    }),
    [t]
  );

  const scenariosWithPreformattedData = useMemo(() => {
    const getScenarioDatasetName = (scenario) => {
      const baseDatasets = scenario?.datasets?.bases ?? [];
      if (baseDatasets.length === 0) return t('views.scenario.text.nodataset', 'None');

      const baseDataset = findDatasetById(baseDatasets?.[0]);
      return baseDataset?.name ?? t('views.scenario.text.datasetNotFound', 'Not found');
    };

    const scenarios = clone(runners) ?? [];
    scenarios.forEach((runner) => {
      runner.canBeDeleted = hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.DELETE, runner);
      runner.canViewSecurity = hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.READ_SECURITY, runner);
      runner.canBeShared = hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.WRITE_SECURITY, runner);

      runner.runTemplateName = t(
        TranslationUtils.getRunTemplateTranslationKey(runner.runTemplateId),
        runner.runTemplateName ?? runner.runTemplateId
      );
      runner.formattedCreationDate =
        runner.createInfo?.timestamp != null ? new Date(runner.createInfo?.timestamp)?.toLocaleString() : undefined;
      runner.datasetName = getScenarioDatasetName(runner);
      runner.ownerName = runner.additionalData?.webapp?.ownerName ?? runner.createInfo?.userId;
      runner.translatedValidationStatus = validationStatusLabels?.[runner.validationStatus?.toLowerCase()] ?? '';
      runner.translatedRunStatus = getTranslatedRunnerLastRunStatus(runner.id);
    });
    return scenarios;
  }, [
    t,
    findDatasetById,
    getTranslatedRunnerLastRunStatus,
    hasUserPermissionOnScenario,
    runners,
    validationStatusLabels,
  ]);

  const rows = useMemo(() => {
    const filteredScenarios = applyScenarioFilter(scenariosWithPreformattedData, searchFieldValue);
    return ResourceUtils.getResourceTree(filteredScenarios);
  }, [scenariosWithPreformattedData, searchFieldValue]);

  const hideFooter = useMemo(() => rows?.length <= 100, [rows?.length]);

  const columns = useMemo(() => {
    return forgeColumns(t, validationStatusLabels);
  }, [t, validationStatusLabels]);

  const isRowSelectable = useCallback((params) => params.row.canBeDeleted, []);

  const [selectedRunnerIds, setSelectedRunnerIds] = useState([]);
  useEffect(() => {
    const selectionAfterFilter = selectedRunnerIds.filter((id) => runners.some((runner) => runner.id === id));
    if (selectionAfterFilter.length !== selectedRunnerIds.length) setSelectedRunnerIds(selectionAfterFilter);
  }, [selectedRunnerIds, runners]);

  const visibleSelectionModel = useMemo(() => {
    const currentRowIds = new Set(rows.map((row) => row.id));
    return selectedRunnerIds.filter((id) => currentRowIds.has(id));
  }, [rows, selectedRunnerIds]);

  const handleSelectionChange = useCallback(
    (newSelectionModel) => {
      const currentRowIds = new Set(rows.map((row) => row.id));
      const hiddenSelected = selectedRunnerIds.filter((id) => !currentRowIds.has(id));
      setSelectedRunnerIds([...hiddenSelected, ...newSelectionModel]);
    },
    [rows, selectedRunnerIds]
  );

  const searchDebounceTimer = React.useRef();
  React.useEffect(() => () => clearTimeout(searchDebounceTimer.current), []);

  const setSearchFieldValueDebounced = useCallback(
    (value, delay = SEARCH_FIELD_DEBOUNCE_DELAY_MS) => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
      setIsSearchPending(true);

      searchDebounceTimer.current = setTimeout(() => {
        setSearchFieldValue(value);
        setIsSearchPending(false);
      }, delay);
    },
    [setSearchFieldValue]
  );

  return {
    isLoading: isSearchPending,
    columns,
    rows,
    hideFooter,
    isRowSelectable,
    selectedRunnerIds,
    visibleSelectionModel,
    handleSelectionChange,
    setSearchFieldValueDebounced,
  };
};
