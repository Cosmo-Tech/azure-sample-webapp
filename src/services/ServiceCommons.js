// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Services
import { CosmotechApiService } from '../configs/Api.config';

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/ScenarioApi.md
export const ScenarioApi = new CosmotechApiService.ScenarioApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/DatasetApi.md
export const DatasetApi = new CosmotechApiService.DatasetApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/ScenariorunApi.md
export const ScenarioRunApi = new CosmotechApiService.ScenariorunApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/SolutionApi.md
export const SolutionApi = new CosmotechApiService.SolutionApi();

// https://github.com/Cosmo-Tech/cosmotech-api-javascript-client/blob/master/docs/WorkspaceApi.md
export const WorkspaceApi = new CosmotechApiService.WorkspaceApi();
