// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import {
  DatasetManager,
  Login,
  ScenarioParameters,
  Scenarios,
  ScenarioSelector,
  Workspaces,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DEFAULT_ORGANIZATION,
  DEFAULT_DATASET,
  DEFAULT_SOLUTION,
  DEFAULT_SIMULATION_RUNNER as DEFAULT_RUNNER,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_RUNNER_PARAMETER_DATASET,
  USER_EXAMPLE as DEFAULT_USER,
  DEFAULT_WORKSPACE,
  WORKSPACE_WITH_DATASET_MANAGER,
} from '../../fixtures/stubbing/default';

const clone = rfdc();

const PRIVATE_ORGANIZATION = clone(DEFAULT_ORGANIZATION);
PRIVATE_ORGANIZATION.id = 'o-private';
PRIVATE_ORGANIZATION.security = { default: 'none', accessControlList: [] };

const PRIVATE_SOLUTION = clone(DEFAULT_SOLUTION);
PRIVATE_SOLUTION.id = 'sol-private';
PRIVATE_SOLUTION.security = { default: 'none', accessControlList: [] };

const WORKSPACE_WITH_PRIVATE_SOLUTION = clone(DEFAULT_WORKSPACE);
WORKSPACE_WITH_PRIVATE_SOLUTION.solution.solutionId = PRIVATE_SOLUTION.id;
const PRIVATE_WORKSPACE = clone(DEFAULT_WORKSPACE);
PRIVATE_WORKSPACE.id = 'w-private';

const PRIVATE_RUNNER = clone(DEFAULT_RUNNER);
PRIVATE_RUNNER.name = 'Private runner';
PRIVATE_RUNNER.id = 'r-private';
PRIVATE_RUNNER.security = { default: 'none', accessControlList: [] };

const PRIVATE_DATASET = clone(DEFAULT_DATASET);
PRIVATE_DATASET.name = 'Private dataset';
PRIVATE_DATASET.id = 'd-private';
PRIVATE_DATASET.security = { default: 'none', accessControlList: [] };
PRIVATE_DATASET.additionalData.webapp.visible = { datasetManager: true };

const VIEWER_GROUP = { id: 'viewerGroup', role: 'viewer', users: [DEFAULT_USER.email] };
const USER_GROUP = { id: 'userGroup', role: 'user', users: [DEFAULT_USER.email] };

describe('Workspace restricted access', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setSolutions([DEFAULT_SOLUTION]);
    stub.setWorkspaces([PRIVATE_WORKSPACE]);
  });

  it('should show no workspace when not in ACL nor groups', () => {
    PRIVATE_WORKSPACE.security = { default: 'none', accessControlList: [] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] });
    Login.login({ workspaceId: false }); // Hack to prevent interception of workspace selection queries
    Workspaces.getNoWorkspacePlaceholder().should('be.visible');
  });

  it('can resolve viewer role from workspace default role', () => {
    PRIVATE_WORKSPACE.security = { default: 'viewer', accessControlList: [] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] });
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
  });

  it('can resolve viewer role from workspace ACL not listed in members (e.g. service accounts)', () => {
    PRIVATE_WORKSPACE.security = { default: 'none', accessControlList: [{ id: DEFAULT_USER.email, role: 'viewer' }] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] });
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
  });

  it('can resolve viewer role from workspace ACL', () => {
    const aclEntry = { id: DEFAULT_USER.email, role: 'viewer' };
    PRIVATE_WORKSPACE.security = { default: 'none', accessControlList: [aclEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [aclEntry], groups: [] });
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
  });

  it('cannot resolve role from workspace group if group is unknown (i.e. not listed by /members endpoint)', () => {
    const aclEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    PRIVATE_WORKSPACE.security = { default: 'none', accessControlList: [aclEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] }); // Groups intentionally left blank
    Login.login({ workspaceId: false }); // Hack to prevent interception of workspace selection queries
    Workspaces.getNoWorkspacePlaceholder().should('be.visible');
  });

  it('can resolve viewer role from workspace group', () => {
    const aclEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    PRIVATE_WORKSPACE.security = { default: 'none', accessControlList: [aclEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [VIEWER_GROUP] });
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
  });

  it('can resolve highest role from workspace default (ignoring ACL specific entry if any)', () => {
    const userACLEntry = { id: DEFAULT_USER.email, role: 'viewer' }; // Viewer role from ACL
    const groupACLEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    // User from default role
    PRIVATE_WORKSPACE.security = { default: 'user', accessControlList: [userACLEntry, groupACLEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [VIEWER_GROUP] }); // Viewer from group
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
  });

  it('can resolve highest role from workspace ACL', () => {
    const userACLEntry = { id: DEFAULT_USER.email, role: 'user' }; // User role from ACL
    const groupACLEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    // Viewer from default role
    PRIVATE_WORKSPACE.security = { default: 'viewer', accessControlList: [userACLEntry, groupACLEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [VIEWER_GROUP] }); // Viewer from group
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
  });

  it('can resolve highest role from workspace group', () => {
    const userACLEntry = { id: DEFAULT_USER.email, role: 'viewer' }; // Viewer role from ACL
    const groupACLEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    // Viewer from default role
    PRIVATE_WORKSPACE.security = { default: 'viewer', accessControlList: [userACLEntry, groupACLEntry] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [USER_GROUP] }); // User from group
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
  });
});

describe('Scenario restricted access (viewerGroup is an unknown group)', () => {
  before(() => stub.start());

  beforeEach(() => {
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setSolutions([DEFAULT_SOLUTION]);
    stub.setWorkspaceMembers(DEFAULT_WORKSPACE.id, {
      users: [{ id: DEFAULT_USER.email, role: 'user' }],
      groups: [USER_GROUP],
    });
    stub.setWorkspaces([DEFAULT_WORKSPACE]);
    stub.setRunners([PRIVATE_RUNNER]);
  });

  it('should show no scenario when not in ACL nor groups', () => {
    PRIVATE_RUNNER.security = { default: 'none', accessControlList: [] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('be.disabled');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
  });

  it('can resolve viewer role from scenario default role', () => {
    PRIVATE_RUNNER.security = { default: 'viewer', accessControlList: [] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('not.exist');
  });

  it('can resolve viewer role from scenario ACL not listed in members (e.g. service accounts)', () => {
    PRIVATE_RUNNER.security = { default: 'none', accessControlList: [{ id: DEFAULT_USER.email, role: 'viewer' }] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] });
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('not.exist');
  });

  it('can resolve viewer role from scenario ACL', () => {
    const aclEntry = { id: DEFAULT_USER.email, role: 'viewer' };
    PRIVATE_RUNNER.security = { default: 'none', accessControlList: [aclEntry] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('not.exist');
  });

  it('cannot resolve role from scenario group if this group is not defined at workspace level', () => {
    // Note: this case is actually "undefined behavior" from the specs point of view, the expected output for this test
    // might evolve in the future
    const aclEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    PRIVATE_RUNNER.security = { default: 'none', accessControlList: [aclEntry] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('be.disabled');
    Scenarios.getDashboardPlaceholder().should(
      'have.text',
      'You can create a scenario by clicking on the "CREATE" button'
    );
  });
});

describe('Scenario restricted access (with viewerGroup added in workspace ACL)', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setSolutions([DEFAULT_SOLUTION]);
    stub.setWorkspaceMembers(DEFAULT_WORKSPACE.id, {
      users: [{ id: DEFAULT_USER.email, role: 'user' }],
      groups: [USER_GROUP, VIEWER_GROUP],
    });
    stub.setWorkspaces([DEFAULT_WORKSPACE]);
    stub.setRunners([PRIVATE_RUNNER]);
  });

  it('can resolve viewer role from scenario group if the group is also defined at the workspace level', () => {
    const aclEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    PRIVATE_RUNNER.security = { default: 'none', accessControlList: [aclEntry] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('not.exist');
  });

  it('can resolve highest role from scenario default (ignoring ACL specific entry if any)', () => {
    const userACLEntry = { id: DEFAULT_USER.email, role: 'viewer' }; // Viewer role from ACL
    const groupACLEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    // Admin from default role
    PRIVATE_RUNNER.security = { default: 'admin', accessControlList: [userACLEntry, groupACLEntry] };
    Login.login();
    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
  });

  it('can resolve highest role from scenario ACL', () => {
    const userACLEntry = { id: DEFAULT_USER.email, role: 'admin' }; // Admin role from ACL
    const groupACLEntry = { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role };
    // Viewer from default role
    PRIVATE_RUNNER.security = { default: 'viewer', accessControlList: [userACLEntry, groupACLEntry] };
    Login.login();

    ScenarioSelector.getScenarioSelectorInput().should('have.value', PRIVATE_RUNNER.name);
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
  });
});

const logInToDatasetManager = () => {
  Login.login({
    url: `/${WORKSPACE_WITH_DATASET_MANAGER.id}/datasetmanager`,
    workspaceId: WORKSPACE_WITH_DATASET_MANAGER.id,
  });
};
describe('Dataset restricted access (viewerGroup is an unknown group)', () => {
  before(() => stub.start());

  beforeEach(() => {
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setSolutions([DEFAULT_SOLUTION]);
    stub.setWorkspaceMembers(WORKSPACE_WITH_DATASET_MANAGER.id, {
      users: [{ id: DEFAULT_USER.email, role: 'user' }],
      groups: [USER_GROUP],
    });
    stub.setWorkspaces([WORKSPACE_WITH_DATASET_MANAGER]);
    stub.setDatasets([PRIVATE_DATASET, DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET]);
  });

  it('should show no dataset when not in ACL nor groups', () => {
    PRIVATE_DATASET.security = { default: 'none', accessControlList: [] };
    logInToDatasetManager();
    DatasetManager.getNoDatasetsPlaceholder().should('be.visible');
  });

  it('can resolve viewer role from dataset default role', () => {
    PRIVATE_DATASET.security = { default: 'viewer', accessControlList: [] };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
  });

  it('can resolve viewer role from dataset ACL not listed in members (e.g. service accounts)', () => {
    PRIVATE_DATASET.security = { default: 'none', accessControlList: [{ id: DEFAULT_USER.email, role: 'viewer' }] };
    stub.setWorkspaceMembers(PRIVATE_WORKSPACE.id, { users: [], groups: [] });
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
  });

  it('can resolve viewer role from dataset ACL', () => {
    const aclEntry = { id: DEFAULT_USER.email, role: 'viewer' };
    PRIVATE_DATASET.security = { default: 'none', accessControlList: [aclEntry] };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
  });

  it('cannot resolve role from dataset group if this group is not defined at workspace level', () => {
    PRIVATE_DATASET.security = {
      default: 'none',
      accessControlList: [{ id: VIEWER_GROUP.id, role: VIEWER_GROUP.role }],
    };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('not.exist');
  });
});

describe('Dataset restricted access (with viewerGroup added in workspace ACL)', () => {
  before(() => stub.start());

  beforeEach(() => {
    stub.setOrganizations([DEFAULT_ORGANIZATION]);
    stub.setSolutions([DEFAULT_SOLUTION]);
    stub.setWorkspaceMembers(WORKSPACE_WITH_DATASET_MANAGER.id, {
      users: [{ id: DEFAULT_USER.email, role: 'user' }],
      groups: [USER_GROUP, VIEWER_GROUP],
    });
    stub.setWorkspaces([WORKSPACE_WITH_DATASET_MANAGER]);
    stub.setDatasets([PRIVATE_DATASET]);
    Login.login({
      url: `/${WORKSPACE_WITH_DATASET_MANAGER.id}/datasetmanager`,
      workspaceId: WORKSPACE_WITH_DATASET_MANAGER.id,
    });
  });

  it('can resolve viewer role from dataset group if the group is also defined at the workspace level', () => {
    PRIVATE_DATASET.security = {
      default: 'none',
      accessControlList: [{ id: VIEWER_GROUP.id, role: VIEWER_GROUP.role }],
    };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
    DatasetManager.getDatasetDeleteButton(PRIVATE_DATASET.id).should('not.exist'); // Not admin
  });

  it('can resolve highest role from dataset default (ignoring ACL specific entry if any)', () => {
    PRIVATE_DATASET.security = {
      default: 'admin',
      accessControlList: [
        { id: DEFAULT_USER.email, role: 'viewer' },
        { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role },
      ],
    };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
    DatasetManager.getDatasetDeleteButton(PRIVATE_DATASET.id).should('be.visible').should('not.be.disabled');
  });

  it('can resolve highest role from dataset ACL', () => {
    PRIVATE_DATASET.security = {
      default: 'viewer',
      accessControlList: [
        { id: DEFAULT_USER.email, role: 'admin' },
        { id: VIEWER_GROUP.id, role: VIEWER_GROUP.role },
      ],
    };
    logInToDatasetManager();
    DatasetManager.getDatasetsListItemButton(PRIVATE_DATASET.id).should('be.visible');
    DatasetManager.getDatasetDeleteButton(PRIVATE_DATASET.id).should('be.visible').should('not.be.disabled');
  });
});

describe('Organization restricted access', () => {
  before(() => stub.start());

  beforeEach(() => {
    Login.login();
    stub.setOrganizations([PRIVATE_ORGANIZATION]);
    stub.setSolutions([PRIVATE_SOLUTION]);
    stub.setWorkspaces([WORKSPACE_WITH_PRIVATE_SOLUTION]);
  });

  // The webapp does not filter Organization and Solution resource based on security: if the back-end returns a
  // response, then access must be granted.
  it('should let user access to workspaces even though the organization & solution are restricted', () => {
    Scenarios.getScenarioView().should('be.visible');
  });
});
