// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_ETL_RUNNER } from '../default';

const EDITABLE_RUNNER = {
  ...DEFAULT_ETL_RUNNER,
  status: 'Running',
  security: { default: 'admin', accessControlList: [] },
  lastRunInfo: { lastRunId: 'run-stbdlastrun', lastRunStatus: 'Successful' },
};

const RUNNER_ETL = {
  ...EDITABLE_RUNNER,
  id: 'r-stbdrnr1',
  name: 'ETL Runner',
  description: 'Runner for ETL',
  runTemplateId: 'etl_run_template',
};

const RUNNER_SUBDATASET = {
  ...EDITABLE_RUNNER,
  id: 'r-stbdrnr2',
  name: 'Subdataset runner',
  description: 'Runner for subdataset ETL',
  runTemplateId: 'subdataset_run_template',
};

export const RUNNERS_FOR_ETL_DATASETS = [RUNNER_ETL, RUNNER_SUBDATASET];
