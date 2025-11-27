// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { RUNNER_RUN_STATE } from '../services/config/ApiConstants.js';
import { useGetETLRunners } from '../state/runner/hooks';
import { DatasetsUtils, RunnersUtils } from '../utils';

export const useGetDatasetRunner = () => {
  const runners = useGetETLRunners();

  return useCallback(
    (dataset) => {
      if (!DatasetsUtils.isCreatedByRunner(dataset)) return;

      const runnerId = DatasetsUtils.getDatasetOption(dataset, 'runnerId');
      if (!runnerId) return console.warn(`No option "runnerId" defined for dataset "${dataset.id}"`);

      const runner = runners != null ? runners.find((runner) => runner.id === runnerId) : null;
      if (!runner) return console.warn(`No runner found with id "${runnerId}"`);

      return runner;
    },
    [runners]
  );
};

// Retrieve the status of the last run of the runner linked to the provided dataset
export const useGetDatasetRunnerStatus = () => {
  const getDatasetRunner = useGetDatasetRunner();

  return useCallback(
    (dataset) => {
      if (!dataset) return RUNNER_RUN_STATE.UNKNOWN;

      // Dataset not created by runners are always "successful"
      if (!DatasetsUtils.isCreatedByRunner(dataset)) return RUNNER_RUN_STATE.SUCCESSFUL;

      const runner = getDatasetRunner(dataset);
      if (!runner) return RUNNER_RUN_STATE.UNKNOWN;

      return RunnersUtils.getLastRunStatus(runner);
    },
    [getDatasetRunner]
  );
};
