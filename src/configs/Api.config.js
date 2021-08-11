// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  DatasetApiFactory,
  ScenarioApiFactory,
  ScenariorunApiFactory,
  SolutionApiFactory,
  WorkspaceApiFactory
} from '@cosmotech/api-ts';
import { clientApi } from '../services/ClientApi';

const DEFAULT_BASE_PATH = 'https://dev.api.cosmotech.com';

// Polling delay to update running scenario status (seconds)
const SCENARIO_STATUS_POLLING_DELAY = 10000;

export const Api = {
  Scenarios: ScenarioApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  ScenarioRuns: ScenariorunApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Solutions: SolutionApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Datasets: DatasetApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Workspaces: WorkspaceApiFactory(null, DEFAULT_BASE_PATH, clientApi)
};

// REST API data object
const API_CONFIG = {
  scenarioStatusPollingDelay: SCENARIO_STATUS_POLLING_DELAY
};

export default API_CONFIG;
