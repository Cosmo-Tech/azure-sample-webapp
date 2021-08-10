// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  DatasetApiFactory,
  ScenarioApiFactory,
  ScenariorunApiFactory,
  SolutionApiFactory,
  WorkspaceApiFactory
} from '@cosmotech/api-ts';
import { clientApi } from '../ClientApi';
import { DEFAULT_BASE_PATH } from '../../config/AppInstance';

export const Api = {
  Scenarios: ScenarioApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  ScenarioRuns: ScenariorunApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Solutions: SolutionApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Datasets: DatasetApiFactory(null, DEFAULT_BASE_PATH, clientApi),
  Workspaces: WorkspaceApiFactory(null, DEFAULT_BASE_PATH, clientApi)
};
