// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  DatasetApiFactory,
  ScenarioApiFactory,
  ScenariorunApiFactory,
  SolutionApiFactory,
  WorkspaceApiFactory,
  OrganizationApiFactory,
  TwingraphApiFactory,
} from '@cosmotech/api-ts';
import { clientApi } from '../ClientApi';
import ConfigService from '../ConfigService';

// Remove trailing slash characters in default base path to prevent CORS errors
const defaultBasePath = ConfigService.getParameterValue('DEFAULT_BASE_PATH').replace(/\/+$/, '');

export const Api = {
  Scenarios: ScenarioApiFactory(null, defaultBasePath, clientApi),
  ScenarioRuns: ScenariorunApiFactory(null, defaultBasePath, clientApi),
  Solutions: SolutionApiFactory(null, defaultBasePath, clientApi),
  Datasets: DatasetApiFactory(null, defaultBasePath, clientApi),
  Workspaces: WorkspaceApiFactory(null, defaultBasePath, clientApi),
  Organizations: OrganizationApiFactory(null, defaultBasePath, clientApi),
  Twingraph: TwingraphApiFactory(null, defaultBasePath, clientApi),
};
