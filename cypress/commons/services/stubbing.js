// Copyright (c) Cosmo Tech
// Licensed under the MIT license

import {
  DEFAULT_SCENARIOS_LIST,
  DEFAULT_DATASETS_LIST,
  DEFAULT_WORKSPACE,
  DEFAULT_WORKSPACES_LIST,
  DEFAULT_SOLUTIONS_LIST,
  SCENARIO_EXAMPLE
} from '../../fixtures/stubbing/default';
import utils from '../TestUtils';
import { API_REGEX, LOCAL_WEBAPP_URL } from '../constants/generic/TestConstants';

const STUB_TYPES = [
  'AUTHENTICATION',
  'GET_DATASETS', // Supports only initial datasets loading, doesn't work for files upload/download or table components
  'GET_SOLUTIONS',
  'GET_WORKSPACES',
  'GET_SCENARIOS',
  'CREATE_AND_DELETE_SCENARIO',
  'UPDATE_SCENARIO',
  'LAUNCH_SCENARIO' // Not supported yet for stubbing
];

// Fake API data makes us able to stub the received workspace data while still using a real workspace for back-end calls
//  - actualWorkspaceId is retrieved from the first API call whose endpoint contains a workspace id (when
//    GET_WORKSPACES is true)
//  - fakeWorkspaceId can be set from the Cypress tests with stub.setFakeWorkspaceId( ... ) to stub all calls to
//    getWorkspaceById and use mock data instead of the data of the actual workspace
const DEFAULT_API_DATA = {
  actualWorkspaceId: null,
  fakeWorkspaceId: null
};

// Fake authentication data makes us able to stub the webapp user identity while still using the token of the user
// actually connected to the webapp to perform API calls to the back-end
// - actualAccessToken is retrieved by intercepting the authentication query, and reused for subsequent calls to the
//   API, allowing us to stub the user roles for local tests and keep a valid token
// - actualUser is retrieved by intercepting the authentication query, and stored in the stubbing class for later use
// - fakeUser can be set from the Cypress tests with stub.setFakeUser( ... ) to stub the response of the authentication
//   queries
// - fakeRoles can be set from the Cypress tests with stub.setFakeRoles( ... ) to stub the response of the authentication
//   queries
const DEFAULT_AUTH_DATA = {
  actualAccessToken: null,
  actualUser: null,
  fakeUser: null,
  fakeRoles: null
};

// Fake resources data allows us to stub CRUD operations on different types of resources such as datasets, scenarios,
// scenarios runs, solutions and workspaces
const DEFAULT_RESOURCES_DATA = {
  datasets: DEFAULT_DATASETS_LIST,
  scenarioRuns: [],
  scenarios: DEFAULT_SCENARIOS_LIST,
  solutions: DEFAULT_SOLUTIONS_LIST,
  workspaces: DEFAULT_WORKSPACES_LIST
};

export const isStubTypeValid = (stubType) => {
  return STUB_TYPES.includes(stubType);
};

export const assertStubTypeIsValid = (stubType) => {
  if (!isStubTypeValid(stubType)) {
    throw `Unknown stub type ${stubType}`;
  }
  return true;
};

class Stubbing {
  constructor() {
    this.auth = DEFAULT_AUTH_DATA;
    this.resources = DEFAULT_RESOURCES_DATA;
    this.api = DEFAULT_API_DATA;

    this.enabledStubs = {};
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = false;
    });
  }

  start = (enabledStubs) => {
    const stubAll = enabledStubs == null;
    // Check provided stub types
    Object.keys(enabledStubs).forEach((stubType) => assertStubTypeIsValid(stubType));
    // Enable stubs individually based on parameters
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = stubAll || enabledStubs[stubType] || false;
    });
  };

  stop = () => {
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = false;
    });
    this.reset();
  };

  reset = () => {
    this.auth = DEFAULT_AUTH_DATA;
    this.resources = DEFAULT_RESOURCES_DATA;
    this.api = DEFAULT_API_DATA;
  };

  isEnabledFor = (stubType) => {
    return assertStubTypeIsValid(stubType) && this.enabledStubs[stubType];
  };

  _getResources = (resourceType) => this.resources[resourceType];
  _setResources = (resourceType, newResources) => (this.resources[resourceType] = newResources);
  _addResource = (resourceType, newResource) => this.resources[resourceType].push(newResource);
  _patchResourceById = (resourceType, scenarioId, resourcePatch) => {
    const resourceIndex = this._getResourceIndexById(resourceType, scenarioId);
    if (resourceIndex !== -1)
      this.resources[resourceType][resourceIndex] = {
        ...this.resources[resourceType][resourceIndex],
        ...resourcePatch
      };
  };
  _getResourceById = (resourceType, resourceId) => {
    return this.resources[resourceType].find((resource) => resource.id === resourceId);
  };
  _getResourceIndexById = (resourceType, resourceId) => {
    return this.resources[resourceType].findIndex((resource) => resource.id === resourceId);
  };
  _getResourceIndexByName = (resourceType, resourceName) => {
    return this.resources[resourceType].findIndex((resource) => resource.name === resourceName);
  };
  _deleteResourceByName = (resourceType, resourceName) => {
    const resourceToDeleteIndex = this._getResourceIndexByName(resourceType, resourceName);
    if (resourceToDeleteIndex !== -1) this.resources[resourceType].splice(resourceToDeleteIndex, 1);
  };

  setActualAccessToken = (token) => (this.auth.actualAccessToken = token);
  getActualAccessToken = () => this.auth.actualAccessToken;
  setAuthenticatedUser = (user) => (this.auth.actualUser = user);
  getAuthenticatedUser = () => this.auth.actualUser;
  setFakeUser = (user) => (this.auth.fakeUser = user);
  getFakeUser = () => this.auth.fakeUser;
  setFakeRoles = (roles) => (this.auth.fakeRoles = roles);
  getFakeRoles = () => this.auth.fakeRoles;

  setActualWorkspaceId = (workspaceId) => (this.api.actualWorkspaceId = workspaceId);
  getActualWorkspaceId = () => this.api.actualWorkspaceId;
  setFakeWorkspaceId = (workspaceId) => (this.api.actualWorkspaceId = workspaceId);
  getFakeWorkspaceId = () => this.api.actualWorkspaceId;

  getScenarios = () => this._getResources('scenarios');
  setScenarios = (newScenarios) => this._setResources('scenarios', newScenarios);
  addScenario = (newScenario) => this._addResource('scenarios', newScenario);
  patchScenario = (scenarioId, scenarioPatch) => this._patchResourceById('scenarios', scenarioId, scenarioPatch);
  getScenarioById = (scenarioId) => this._getResourceById('scenarios', scenarioId);
  deleteScenarioByName = (scenarioName) => this._deleteResourceByName('scenarios', scenarioName);

  patchScenarioDefaultSecurity = (scenarioId, newDefaultSecurity) => {
    const scenario = this.getScenarioById(scenarioId);
    const newScenarioSecurity = {
      security: {
        default: newDefaultSecurity,
        accessControlList: scenario.security.accessControlList
      }
    };
    patchScenario(scenarioId, newScenarioSecurity);
  };

  patchScenarioACLSecurity = (scenarioId, newACLSecurity) => {
    const scenario = this.getScenarioById(scenarioId);
    const newScenarioSecurity = {
      security: {
        default: scenario.security.default,
        accessControlList: newACLSecurity
      }
    };
    patchScenario(scenarioId, newScenarioSecurity);
  };

  getDatasets = () => this._getResources('datasets');
  setDatasets = (newDatasets) => this._setResources('datasets', newDatasets);
  addDataset = (newDataset) => this._addResource('datasets', newDataset);
  getDatasetById = (datasetId) => this._getResourceById('datasets', datasetId);

  getSolutions = () => this._getResources('solutions');
  setSolutions = (newSolutions) => this._setResources('solutions', newSolutions);
  getSolutionById = (solutionId) => this._getResourceById('solutions', solutionId);

  getWorkspaces = () => this._getResources('workspaces');
  setWorkspaces = (newSolutions) => this._setResources('workspaces', newWorkspaces);
  getWorkspaceById = (workspaceId) => this._getResourceById('workspaces', workspaceId);
}

export const stub = new Stubbing();
