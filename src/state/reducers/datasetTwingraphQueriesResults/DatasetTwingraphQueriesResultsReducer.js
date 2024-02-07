// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { KPI_STATE } from '../../../services/config/kpiConstants.js';
import { DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS } from '../../commons/DatasetConstants';

export const initialState = {};

const resetDatasetResults = (state, action) => {
  const { datasetId, workspace } = action.payload;
  state[datasetId] = {};
  [workspace?.indicators?.categoriesKpis, workspace?.indicators?.graphIndicators]
    .flat()
    .forEach((kpiId) => (state[datasetId][kpiId] = { state: KPI_STATE.IDLE }));
};

export const datasetTwingraphQueriesResultsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.INITIALIZE, (state, action) => {
      const { datasetId } = action.payload;
      if (Object.keys(state?.[datasetId] ?? {}).length === 0) resetDatasetResults(state, action);
    })
    .addCase(DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.RESET, resetDatasetResults)
    .addCase(DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.WAITING, (state, action) => {
      const { datasetId, queriesMapping, queryId } = action.payload;
      const kpis = queriesMapping[queryId] ?? [];
      kpis.forEach((kpiId) => (state[datasetId][kpiId] = { state: KPI_STATE.LOADING }));
    })
    .addCase(DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.PROCESS, (state, action) => {
      const { datasetId, queriesMapping, queryId, result } = action.payload;
      if (result.data) {
        const expectedKpis = [...queriesMapping[queryId]];
        result.data.forEach((result) => {
          for (const [kpiId, kpiValue] of Object.entries(result)) {
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
    });
});
