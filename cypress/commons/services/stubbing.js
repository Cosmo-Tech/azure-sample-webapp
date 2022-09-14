// Copyright (c) Cosmo Tech
// Licensed under the MIT license

import {
  DEFAULT_SCENARIOS_LIST,
  DEFAULT_DATASETS_LIST,
  DEFAULT_WORKSPACE,
  DEFAULT_SOLUTION,
  SCENARIO_EXAMPLE
} from '../../fixtures/stubbing/default';
import utils from '../TestUtils';
import { API_REGEX, LOCAL_WEBAPP_URL } from '../constants/generic/TestConstants';

const STUB_TYPES = [
  'AUTHENTICATION',
  'GET_DATASETS', // Not supported yet for stubbing
  'GET_SOLUTIONS', // Not supported yet for stubbing
  'GET_WORKSPACES', // Not supported yet for stubbing
  'GET_SCENARIOS',
  'CREATE_AND_DELETE_SCENARIO',
  'UPDATE_SCENARIO', // Not supported yet for stubbing
  'LAUNCH_SCENARIO' // Not supported yet for stubbing
];

const DEFAULT_AUTH_DATA = {
  actualAccessToken: null,
  actualUser: null,
  fakeUser: null,
  fakeRoles: null
};

const DEFAULT_RESOURCES_DATA = {
  datasets: [],
  scenarioRuns: [],
  scenarios: [],
  solutions: [],
  workspaces: []
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
  };

  isEnabledFor = (stubType) => {
    return assertStubTypeIsValid(stubType) && this.enabledStubs[stubType];
  };

  _getResources = (resourceType) => this.resources[resourceType];
  _setResources = (resourceType, newResources) => (this.resources[resourceType] = newResources);
  _addResource = (resourceType, newResource) => this.resources[resourceType].push(newResource);
  _getResourceById = (resourceType, resourceId) => {
    return this.resources[resourceType].find((resource) => resource.id === resourceId);
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

  getScenarios = () => this._getResources('scenarios');
  setScenarios = (newScenarios) => this._setResources('scenarios', newScenarios);
  addScenario = (newScenario) => this._addResource('scenarios', newScenario);
  getScenarioById = (scenarioId) => this._getResourceById('scenarios', scenarioId);
  deleteScenarioByName = (scenarioName) => this._deleteResourceByName('scenarios', scenarioName);
}

export const stub = new Stubbing();
