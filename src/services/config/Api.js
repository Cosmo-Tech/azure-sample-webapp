// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  DatasetApiFactory,
  RunnerApiFactory,
  RunApiFactory,
  SolutionApiFactory,
  WorkspaceApiFactory,
  OrganizationApiFactory,
} from '@cosmotech/api-ts';
import { clientApi } from '../ClientApi';
import ConfigService from '../ConfigService';

// Remove trailing slash characters in default base path to prevent CORS errors
const defaultBasePath = ConfigService.getParameterValue('DEFAULT_BASE_PATH').replace(/\/+$/, '');

export const Api = {
  defaultBasePath,
  Solutions: SolutionApiFactory(null, defaultBasePath, clientApi),
  Datasets: DatasetApiFactory(null, defaultBasePath, clientApi),
  Runners: RunnerApiFactory(null, defaultBasePath, clientApi),
  RunnerRuns: RunApiFactory(null, defaultBasePath, clientApi),
  Workspaces: WorkspaceApiFactory(null, defaultBasePath, clientApi),
  Organizations: OrganizationApiFactory(null, defaultBasePath, clientApi),
};
