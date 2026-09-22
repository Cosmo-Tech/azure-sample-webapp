// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login } from '../../commons/actions';
import { RolesEdition } from '../../commons/actions/generic/RolesEdition';
import { ROLES } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  DEFAULT_DATASETS,
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_SIMULATION_RUNNER,
  DEFAULT_WORKSPACE,
  USER_EXAMPLE,
  USERS_LIST,
} from '../../fixtures/stubbing/default';

const DATASET_GROUP = { id: 'datasetGroup', role: ROLES.WORKSPACE.VIEWER, users: [USERS_LIST[1].email] };
const SCENARIO_GROUP = { id: 'scenarioGroup', role: ROLES.WORKSPACE.VIEWER, users: [USERS_LIST[2].email] };
const RESTRICTED_GROUP = { id: 'restrictedGroup', role: ROLES.WORKSPACE.VIEWER, users: [] };

const workspace = {
  ...DEFAULT_WORKSPACE,
  security: {
    default: ROLES.WORKSPACE.NONE,
    accessControlList: [{ id: USER_EXAMPLE.email, role: ROLES.WORKSPACE.ADMIN }],
  },
};

const scenario = {
  ...DEFAULT_SIMULATION_RUNNER,
  security: {
    default: ROLES.RUNNER.VIEWER,
    accessControlList: [
      { id: USER_EXAMPLE.email, role: ROLES.RUNNER.ADMIN },
      { id: SCENARIO_GROUP.id, role: ROLES.RUNNER.ADMIN },
      { id: USERS_LIST[2].email, role: ROLES.RUNNER.VIEWER },
    ],
  },
};

const baseDataset = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  security: {
    default: ROLES.DATASET.NONE,
    accessControlList: [
      { id: USER_EXAMPLE.email, role: ROLES.DATASET.ADMIN },
      { id: DATASET_GROUP.id, role: ROLES.DATASET.VIEWER },
      { id: SCENARIO_GROUP.id, role: ROLES.DATASET.VIEWER },
    ],
  },
};

describe('Scenario sharing with workspace groups', () => {
  before(() => stub.start());

  beforeEach(() => {
    stub.setWorkspaces([workspace]);
    stub.setWorkspaceMembers(workspace.id, {
      users: [
        { id: USER_EXAMPLE.email, role: ROLES.WORKSPACE.ADMIN },
        { id: USERS_LIST[2].email, role: ROLES.WORKSPACE.VIEWER },
        { id: USERS_LIST[3].email, role: ROLES.WORKSPACE.VIEWER },
      ],
      groups: [DATASET_GROUP, SCENARIO_GROUP, RESTRICTED_GROUP],
    });
    stub.setRunners([scenario]);
    stub.setDatasets(DEFAULT_DATASETS.map((dataset) => (dataset.id === baseDataset.id ? baseDataset : dataset)));
    Login.login();
    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
  });

  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('displays explicit scenario ACL roles & lists all workspace users and groups not in ACL', () => {
    RolesEdition.getSelectedOptionByAgent('Workspace').should('have.value', ROLES.RUNNER.VIEWER);
    RolesEdition.getSelectedOptionByAgent(SCENARIO_GROUP.id).should('have.value', ROLES.RUNNER.ADMIN);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[2].email).should('have.value', ROLES.RUNNER.VIEWER);
    RolesEdition.getRoleEditorByAgent(USERS_LIST[1].email).should('not.exist');

    RolesEdition.getShareDialogAgentsSelect().click();

    // Check dropdown list content
    [USERS_LIST[1].email, USERS_LIST[3].email, DATASET_GROUP.id, RESTRICTED_GROUP.id].forEach((agentId) => {
      RolesEdition.getShareDialogAgentsSelectAgentName(agentId).should('be.visible');
    });
    [USER_EXAMPLE.email, USERS_LIST[2].email, SCENARIO_GROUP.id].forEach((agentId) => {
      RolesEdition.getShareDialogAgentsSelectAgentName(agentId).should('not.exist');
    });

    // Check which options are disabled because of dataset-access restrictions
    RolesEdition.getShareDialogAgentsSelectAgentName(RESTRICTED_GROUP.id)
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true');
    RolesEdition.getShareDialogAgentsSelectAgentName(USERS_LIST[3].email)
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true');
    RolesEdition.getShareDialogAgentsSelectAgentName(DATASET_GROUP.id).should('not.have.attr', 'aria-disabled', 'true');
  });

  it('allows sharing with a user who inherits base dataset access from a group', () => {
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VIEWER).should('be.checked');
    RolesEdition.getShareDialogConfirmAddAccessButton().click();

    const alias = apiUtils.interceptUpdateSimulationRunnerACLSecurity({
      id: USERS_LIST[1].email,
      role: ROLES.RUNNER.VIEWER,
    });
    RolesEdition.getShareDialogSubmitButton().click();
    apiUtils.waitAlias(alias);
  });

  it('shares with a group using its ID in the scenario security API request', () => {
    RolesEdition.addAgent(DATASET_GROUP.id);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).click();
    RolesEdition.getShareDialogConfirmAddAccessButton().click();

    const alias = apiUtils.interceptUpdateSimulationRunnerACLSecurity({
      id: DATASET_GROUP.id,
      role: ROLES.RUNNER.EDITOR,
    });
    RolesEdition.getShareDialogSubmitButton().click();
    apiUtils.waitAlias(alias).its('request.url').should('include', `/runners/${scenario.id}/security/access`);

    RolesEdition.getShareButton().click();
    RolesEdition.getSelectedOptionByAgent(DATASET_GROUP.id).should('have.value', ROLES.RUNNER.EDITOR);
  });
});
