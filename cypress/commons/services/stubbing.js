// Copyright (c) Cosmo Tech
// Licensed under the MIT license
import rfdc from 'rfdc';
import {
  DEFAULT_ORGANIZATION_PERMISSIONS,
  DEFAULT_RUNNERS,
  DEFAULT_DATASETS,
  DEFAULT_WORKSPACE,
  DEFAULT_WORKSPACES,
  DEFAULT_ORGANIZATION,
  DEFAULT_ORGANIZATIONS,
  DEFAULT_SOLUTIONS,
} from '../../fixtures/stubbing/default';
import { authUtils as auth } from '../utils/authUtils';

const STUB_TYPES = [
  'AUTHENTICATION',
  'CREATE_AND_DELETE_SCENARIO',
  'CREATE_DATASET', // Only supports datasets created after the "save" action, "save & launch" is not supported yet
  'GET_DATASETS',
  'GET_ORGANIZATION',
  'GET_SOLUTIONS',
  'GET_WORKSPACES',
  'GET_SCENARIOS',
  'LAUNCH_SCENARIO',
  'PERMISSIONS_MAPPING',
  'UPDATE_DATASET',
  'UPDATE_SCENARIO',
];

const clone = rfdc();

// Fake API data makes us able to stub the received workspace data while still using a real workspace for back-end calls
//  - actualWorkspaceId is retrieved from the first API call whose endpoint contains a workspace id (when
//    GET_WORKSPACES is true)
//  - organizationPermissions define the roles/permissions mapping currently returned by an endpoint at the organization
//    level
const DEFAULT_API_DATA = {
  actualWorkspaceId: null,
  fakeWorkspaceId: null,
  organizationPermissions: clone(DEFAULT_ORGANIZATION_PERMISSIONS),
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
  fakeRoles: null,
};

// Fake resources data allows us to stub CRUD operations on different types of resources such as datasets, runners,
// runner runs, solutions and workspaces
const DEFAULT_RESOURCES_DATA = {
  datasets: clone(DEFAULT_DATASETS),
  runners: clone(DEFAULT_RUNNERS),
  runnerRuns: [],
  solutions: clone(DEFAULT_SOLUTIONS),
  workspaces: clone(DEFAULT_WORKSPACES),
  organizations: clone(DEFAULT_ORGANIZATIONS),
};

// Default stubbing options to fake runner runs. By default, the runs will end immediately with a
// 'Successful' status. To change these default options in a test, use stubbing.setRunnerRunOptions(options)
// - runDuration represents the duration (in ms) of the 'Running' status, before it changes
//   to the final status
// - finalStatus must be one of 'Failed', 'Successful' or 'Unknown'
// - expectedPollsCount is an integer representing the number of polling requests to intercept
const DEFAULT_RUNNER_RUNS_OPTIONS = {
  runDuration: 0,
  finalStatus: 'Successful',
  expectedPollsCount: 1,
  startTime: new Date(),
};

// Default stubbing options to fake dataset import jobs. By default, the dataset import will end immediately with a
// 'SUCCESS' status. To change these default options in a test, use stubbing.setDatasetImportOptions(options)
// - importJobDuration represents the duration (in ms) of the 'PENDING' status, before it changes to the final status
// - finalIngestionStatus must be one of 'NONE', 'PENDING', 'ERROR', 'SUCCESS' or 'UNKNOWN'
// - expectedPollsCount is an integer representing the number of polling requests to intercept
const DEFAULT_DATASET_IMPORT_OPTIONS = {
  importJobDuration: 0,
  finalIngestionStatus: 'SUCCESS',
  expectedPollsCount: 1,
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

const forgeRunnerRunStatus = (runnerRun) => ({
  id: runnerRun.id,
  organizationId: runnerRun.organizationId,
  workspaceId: runnerRun.workspaceId,
  workflowId: runnerRun.workflowId,
  workflowName: runnerRun.workflowName,
  createInfo: null,
  startTime: new Date().toISOString(),
  endTime: null,
  phase: 'Running',
  progress: '0/1',
  message: null,
  estimatedDuration: null,
  nodes: [],
  state: 'Running',
});

class Stubbing {
  constructor() {
    this.reset();
    this.workspaceFiles = {}; // TODO: isolate each workspace instead of using only one Object

    this.enabledStubs = {};
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = false;
    });
  }

  start = (enabledStubs) => {
    const stubAll = enabledStubs == null;
    // Check provided stub types
    Object.keys(enabledStubs ?? {}).forEach((stubType) => assertStubTypeIsValid(stubType));
    // Enable stubs individually based on parameters
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = stubAll || enabledStubs[stubType] || false;
    });
    // Force authentication stubbing when using service account for authentication
    if (auth.USE_SERVICE_ACCOUNT) this.enabledStubs['AUTHENTICATION'] = true;
  };

  stop = () => {
    STUB_TYPES.forEach((stubType) => {
      this.enabledStubs[stubType] = false;
    });
    this.reset();
  };

  reset = () => {
    this.auth = clone(DEFAULT_AUTH_DATA);
    this.resources = clone(DEFAULT_RESOURCES_DATA);
    this.api = clone(DEFAULT_API_DATA);
    this.runnerRunOptions = clone(DEFAULT_RUNNER_RUNS_OPTIONS);
    this.datasetImportOptions = DEFAULT_DATASET_IMPORT_OPTIONS;
  };

  isEnabledFor = (stubType) => {
    return assertStubTypeIsValid(stubType) && this.enabledStubs[stubType];
  };

  _getResources = (resourceType) => this.resources[resourceType];
  _setResources = (resourceType, newResources) => (this.resources[resourceType] = newResources);
  _addResource = (resourceType, newResource) => this.resources[resourceType].push(newResource);
  _patchResourceById = (resourceType, resourceId, resourcePatch) => {
    const resourceIndex = this._getResourceIndexById(resourceType, resourceId);
    if (resourceIndex !== -1)
      this.resources[resourceType][resourceIndex] = {
        ...this.resources[resourceType][resourceIndex],
        ...resourcePatch,
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

  getUser = () =>
    this.isEnabledFor('AUTHENTICATION') && this.getFakeUser() != null
      ? this.getFakeUser()
      : this.getAuthenticatedUser();

  setActualWorkspaceId = (workspaceId) => (this.api.actualWorkspaceId = workspaceId);
  getActualWorkspaceId = () => this.api.actualWorkspaceId;
  getFakeWorkspaceId = () => this.api.fakeWorkspaceId;
  setOrganizationPermissions = (newMapping) => (this.api.organizationPermissions = newMapping);
  getOrganizationPermissions = () => this.api.organizationPermissions;

  getOrganizations = () => this._getResources('organizations');
  setOrganizations = (newOrganizations) => this._setResources('organizations', newOrganizations);
  patchOrganization = (organizationId, organizationPatch) =>
    this._patchResourceById('organizations', organizationId, organizationPatch);
  getOrganizationById = (organizationId) => this._getResourceById('organizations', organizationId);
  getDefaultOrganizationId = () => this.getOrganizations()?.[0]?.id ?? DEFAULT_ORGANIZATION.id;

  getRunners = () => this._getResources('runners');
  setRunners = (newRunners) => this._setResources('runners', newRunners);
  addRunner = (newRunner) => this._addResource('runners', newRunner);
  patchRunner = (runnerId, runnerPatch) => this._patchResourceById('runners', runnerId, runnerPatch);
  getRunnerById = (runnerId) => this._getResourceById('runners', runnerId);
  deleteRunnerByName = (runnerName) => this._deleteResourceByName('runners', runnerName);

  patchRunnerDefaultSecurity = (runnerId, newDefaultSecurity) => {
    const runner = this.getRunnerById(runnerId);
    const newRunnerSecurity = {
      security: {
        default: newDefaultSecurity,
        accessControlList: runner.security.accessControlList,
      },
    };
    this.patchRunner(runnerId, newRunnerSecurity);
  };

  patchRunnerACLSecurity = (runnerId, newACLSecurityItem) => {
    const runner = this.getRunnerById(runnerId);
    const newACL = [...runner.security.accessControlList, newACLSecurityItem];
    const newRunnerSecurity = {
      security: {
        default: runner.security.default,
        accessControlList: newACL,
      },
    };
    this.patchRunner(runnerId, newRunnerSecurity);
  };

  getDatasets = () => this._getResources('datasets');
  setDatasets = (newDatasets) => this._setResources('datasets', newDatasets);
  addDataset = (newDataset) => this._addResource('datasets', newDataset);
  getDatasetById = (datasetId) => this._getResourceById('datasets', datasetId);
  deleteDatasetByName = (datasetName) => this._deleteResourceByName('datasets', datasetName);

  patchDatasetDefaultSecurity = (datasetId, newDefaultSecurity) => {
    const dataset = this.getDatasetById(datasetId);
    const newDatasetSecurity = {
      security: {
        default: newDefaultSecurity,
        accessControlList: dataset.security.accessControlList,
      },
    };
    this.patchDataset(datasetId, newDatasetSecurity);
  };

  patchDatasetACLSecurity = (datasetId, newACLSecurityItem) => {
    const dataset = this.getDatasetById(datasetId);
    const newACL = [...dataset.security.accessControlList, newACLSecurityItem];
    const newDatasetSecurity = {
      security: {
        default: dataset.security.default,
        accessControlList: newACL,
      },
    };
    this.patchDataset(datasetId, newDatasetSecurity);
  };

  patchDataset = (datasetId, datasetPatch) => this._patchResourceById('datasets', datasetId, datasetPatch);

  patchDatasetSecurity = (datasetId, defaultRole, accessControlList) =>
    this.patchDataset(datasetId, { security: { default: defaultRole, accessControlList: accessControlList } });

  patchDatasetDefaultSecurity = (datasetId, newDefaultSecurity) => {
    const dataset = this.getDatasetById(datasetId);
    this.patchDatasetSecurity(datasetId, newDefaultSecurity, dataset.security?.accessControlList ?? []);
  };

  addDatasetAccessControl = (datasetId, newACLSecurityItem) => {
    const dataset = this.getDatasetById(datasetId);
    const newACL = [...dataset.security.accessControlList, newACLSecurityItem];
    this.patchDatasetSecurity(datasetId, dataset.security?.default, newACL);
  };

  updateDatasetAccessControl = (datasetId, aclEntryToUpdate) => {
    const dataset = this.getDatasetById(datasetId);
    const newACL = (dataset.security?.accessControlList ?? []).map((entry) =>
      entry.id === aclEntryToUpdate.id ? aclEntryToUpdate : entry
    );
    this.patchDatasetSecurity(datasetId, dataset.security?.default, newACL);
  };

  removeDatasetAccessControl = (datasetId, idToRemove) => {
    const dataset = this.getDatasetById(datasetId);
    const newACL = (dataset.security?.accessControlList ?? []).filter((entry) => entry.id !== idToRemove);
    this.patchDatasetSecurity(datasetId, dataset.security?.default, newACL);
  };

  getSolutions = () => this._getResources('solutions');
  setSolutions = (newSolutions) => this._setResources('solutions', newSolutions);
  getSolutionById = (solutionId) => this._getResourceById('solutions', solutionId);

  getRunnerRuns = () => this._getResources('runnerRuns');
  setRunnerRuns = (newRunnerRuns) => this._setResources('runnerRuns', newRunnerRuns);
  addRunnerRun = (newRunnerRun) => {
    newRunnerRun.status = forgeRunnerRunStatus(newRunnerRun);
    this._addResource('runnerRuns', newRunnerRun);
  };
  patchRunnerRun = (runnerRunId, runnerRunPatch) => this._patchResourceById('runnerRuns', runnerRunId, runnerRunPatch);
  getRunnerRunById = (runId) => this._getResourceById('runnerRuns', runId);

  getWorkspaces = () => this._getResources('workspaces');
  setWorkspaces = (newWorkspaces) => this._setResources('workspaces', newWorkspaces);
  getWorkspaceById = (workspaceId) => this._getResourceById('workspaces', workspaceId);
  getDefaultWorkspaceId = () => DEFAULT_WORKSPACE.id;

  setRunnerRunOptions = (options) => (this.runnerRunOptions = { ...this.runnerRunOptions, ...options });
  getRunnerRunOptions = () => this.runnerRunOptions;

  setDatasetImportOptions = (options) => (this.datasetImportOptions = { ...this.datasetImportOptions, ...options });
  getDatasetImportOptions = () => this.datasetImportOptions;

  getWorkspaceFiles = () => this.workspaceFiles;
  setWorkspaceFiles = (newWorkspaceFiles) => (this.workspaceFiles = newWorkspaceFiles);
  addWorkspaceFile = (fileName, fileContent) => (this.workspaceFiles[fileName] = fileContent);
  getWorkspaceFile = (fileName) => this.workspaceFiles[fileName];
}

export const stub = new Stubbing();
