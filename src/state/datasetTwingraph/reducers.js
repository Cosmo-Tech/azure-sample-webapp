// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { KPI_STATE } from '../../services/config/kpiConstants.js';

export const initialState = {};

const resetDatasetResults = (state, action) => {
  const { datasetId, workspace } = action.payload;
  state[datasetId] = {};
  [workspace?.indicators?.categoriesKpis, workspace?.indicators?.graphIndicators]
    .flat()
    .forEach((kpiId) => (state[datasetId][kpiId] = { state: KPI_STATE.IDLE }));
};

const datasetTwingraphQueriesResultsSlice = createSlice({
  name: 'datasetTwingraph',
  initialState,
  reducers: {
    initializeQueriesResults: (state, action) => {
      const { datasetId } = action.payload;
      if (Object.keys(state?.[datasetId] ?? {}).length === 0) resetDatasetResults(state, action);
    },
    resetQueriesResults: (state, action) => {
      resetDatasetResults(state, action);
    },
    waitQueriesResults: (state, action) => {
      const { datasetId, queriesMapping, queryId } = action.payload;
      const kpis = queriesMapping[queryId] ?? [];
      kpis.forEach((kpiId) => (state[datasetId][kpiId] = { state: KPI_STATE.LOADING }));
    },
    processQueriesResults: (state, action) => {
      const { datasetId, queriesMapping, queryId, result } = action.payload;
      if (result.data) {
        const expectedKpis = [...queriesMapping[queryId]];
        result.data.forEach((result) => {
          for (const [kpiId, kpiValue] of Object.entries(result)) {
            if (!(kpiId in state[datasetId])) {
              continue; // Value kpiId computed in query queryId does not seem to be used in any KPI or graph indicator
            }
            state[datasetId][kpiId].value = kpiValue;
            state[datasetId][kpiId].state = KPI_STATE.READY;
            const kpiIndex = expectedKpis.indexOf(kpiId);
            if (kpiIndex !== -1) expectedKpis.splice(kpiIndex, 1);
          }
        });
        expectedKpis.forEach((missingKpi) => (state[datasetId][missingKpi].state = KPI_STATE.UNKNOWN));
      } else {
        if (result.config.data) console.error(`Query to twingraph failed: ${result.config.data}`);
        queriesMapping?.[queryId].forEach((kpiId) => (state[datasetId][kpiId].state = KPI_STATE.FAILED));
      }
    },
  },
});
export const { initializeQueriesResults, resetQueriesResults, waitQueriesResults, processQueriesResults } =
  datasetTwingraphQueriesResultsSlice.actions;
export default datasetTwingraphQueriesResultsSlice.reducer;
