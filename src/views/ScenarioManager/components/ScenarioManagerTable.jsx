// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SearchBar } from '@cosmotech/ui';
import { DeleteScenarioBatchButton } from './DeleteScenarioBatchButton';
import { useScenarioManagerTable } from './ScenarioManagerTableHook';

export const ScenarioManagerTable = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    columns,
    rows,
    hideFooter,
    isRowSelectable,
    selectedRunnerIds,
    visibleSelectionModel,
    handleSelectionChange,
    setSearchFieldValueDebounced,
  } = useScenarioManagerTable();

  const columnIds = useMemo(() => columns.map((column) => column.field), [columns]);
  return (
    <Stack spacing={4} sx={{ m: 2, mt: 3, height: 'calc(100% - 90px)' }}>
      <Stack direction="row" spacing={2} gap={4} sx={{ m: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <SearchBar
          data-cy="scenario-manager-search-field"
          label={t('commoncomponents.scenariomanager.treelist.node.text.search', 'Search')}
          sx={{ flex: 1, maxWidth: '535px', minWidth: '300px', height: '50px' }}
          onSearchChange={setSearchFieldValueDebounced}
          debounceDelay={0}
        />
        {<DeleteScenarioBatchButton runnerIdsToDelete={selectedRunnerIds} />}
      </Stack>
      <Box sx={{ height: 'calc(100% - 97px)' }}>
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          autosizeOptions={{
            columns: columnIds,
            includeOutliers: true,
            includeHeaders: true,
            expand: true,
          }}
          checkboxSelection
          disableColumnFilter
          disableColumnSorting
          disableRowSelectionOnClick
          isRowSelectable={isRowSelectable}
          rowSelectionModel={visibleSelectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          hideFooter={hideFooter}
          slotProps={{ baseCheckbox: { sx: { color: (theme) => theme.palette.primary.main } } }}
        />
      </Box>
    </Stack>
  );
};
