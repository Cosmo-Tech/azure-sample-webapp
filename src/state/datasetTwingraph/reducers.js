// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { KPI_STATE } from '../../services/config/kpiConstants';
import {
  getColumnFirstValue,
  getConcatenatedColumnValues,
  parseCSVFromAPIResponse,
} from '../../utils/DatasetQueryUtils';

export const initialState = {};

const resetDatasetResults = (state, action) => {
  const { dataset, workspace } = action.payload;
  state[dataset.id] = {};

  for (const [queryId, kpiIds] of Object.entries(workspace?.kpiIdsByQueryId)) {
    state[dataset.id][queryId] = {};
    kpiIds.forEach((kpiId) => (state[dataset.id][queryId][kpiId] = { state: KPI_STATE.IDLE }));
  }
};

const datasetTwingraphQueriesResultsSlice = createSlice({
  name: 'datasetTwingraph',
  initialState,
  reducers: {
    initializeQueriesResults: (state, action) => {
      const { dataset } = action.payload;
      const datasetId = dataset.id;
      if (Object.keys(state?.[datasetId] ?? {}).length === 0) resetDatasetResults(state, action);
    },
    resetQueriesResults: (state, action) => {
      resetDatasetResults(state, action);
    },
    waitQueryResults: (state, action) => {
      const { datasetId, kpiIdsByQueryId, queryId } = action.payload;
      const kpis = kpiIdsByQueryId[queryId] ?? [];
      kpis.forEach((kpiId) => (state[datasetId][queryId][kpiId] = { state: KPI_STATE.LOADING }));
    },
    processQueriesResults: (state, action) => {
      const { datasetId, kpiIdsByQueryId, queryId, result } = action.payload;
      const resultColsAndRows = parseCSVFromAPIResponse(result);
      if (!result || result.length === 0) {
        // FIXME: is it still possible to have result.config.data?
        if (result.config.data) console.error(`Query to twingraph failed: ${result.config.data}`);
        kpiIdsByQueryId?.[queryId].forEach((kpiId) => (state[datasetId][queryId][kpiId].state = KPI_STATE.FAILED));
      }

      const expectedKpis = [...kpiIdsByQueryId[queryId]];
      const cols = resultColsAndRows.cols.map((col) => col.field);

      for (const columnName of cols) {
        if (!(columnName in state[datasetId][queryId])) {
          console.warn(
            `Unused column "${columnName}" in dataset query "${queryId}". If this column is not used, ` +
              'consider removing it from the query to improve performance'
          );
          continue;
        }

        const kpiIndex = expectedKpis.indexOf(columnName);
        if (kpiIndex !== -1) {
          expectedKpis.splice(kpiIndex, 1);
          const kpiValue =
            resultColsAndRows.rows.length > 1
              ? getConcatenatedColumnValues(resultColsAndRows, columnName)
              : getColumnFirstValue(resultColsAndRows, columnName);
          state[datasetId][queryId][columnName] = { value: kpiValue, state: KPI_STATE.READY };
        }
      }
      expectedKpis.forEach((missingKpi) => (state[datasetId][queryId][missingKpi].state = KPI_STATE.UNKNOWN));
    },
  },
});

export const { initializeQueriesResults, resetQueriesResults, waitQueryResults, processQueriesResults } =
  datasetTwingraphQueriesResultsSlice.actions;

export default datasetTwingraphQueriesResultsSlice.reducer;
