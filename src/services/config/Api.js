// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  DatasetApiFactory,
  RunnerApiFactory,
  RunApiFactory,
  SolutionApiFactory,
  WorkspaceApiFactory,
  OrganizationApiFactory,
  MetaApiFactory,
} from '@cosmotech/api-ts';
import { StringUtils } from '../../utils/StringUtils';
import { clientApi } from '../ClientApi';
import ConfigService from '../ConfigService';

// Remove trailing slash characters in default base path to prevent CORS errors
const defaultBasePath = StringUtils.trimTrailingSlashes(ConfigService.getParameterValue('DEFAULT_BASE_PATH'));

export const Api = {
  defaultBasePath,
  Meta: MetaApiFactory(null, defaultBasePath, clientApi),
  Solutions: SolutionApiFactory(null, defaultBasePath, clientApi),
  Datasets: DatasetApiFactory(null, defaultBasePath, clientApi),
  Runners: RunnerApiFactory(null, defaultBasePath, clientApi),
  RunnerRuns: RunApiFactory(null, defaultBasePath, clientApi),
  Workspaces: WorkspaceApiFactory(null, defaultBasePath, clientApi),
  Organizations: OrganizationApiFactory(null, defaultBasePath, clientApi),
};
