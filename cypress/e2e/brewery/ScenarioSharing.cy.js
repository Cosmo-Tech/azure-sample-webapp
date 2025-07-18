// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  Login,
  Scenarios,
  ScenarioParameters,
  ScenarioManager,
  ScenarioSelector,
  FileParameters,
} from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { RolesEdition } from '../../commons/actions/generic/RolesEdition';
import { ROLES, ROLES_PERMISSIONS_MAP } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';
import {
  PRIVATE_SCENARIOS_LIST,
  SHARED_SCENARIOS_LIST,
  NO_ROOT_SCENARIOS_LIST,
  WORKSPACE_WITH_USERS_LIST,
} from '../../fixtures/stubbing/ScenarioSharing';
import { USER_EXAMPLE, USERS_LIST } from '../../fixtures/stubbing/default';

describe('Check workspace permissions for admin', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(PRIVATE_SCENARIOS_LIST);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can create, edit, launch, validate, share, rename & delete a scenario', () => {
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).should('not.be.disabled').click();
    RolesEdition.getShareDialogConfirmAddAccessButton().should('not.be.disabled').click();
    RolesEdition.getShareDialogFirstCancelButton().click();
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(PRIVATE_SCENARIOS_LIST[0].id);
    ScenarioManager.getDeleteScenarioButton().should('be.visible').should('not.be.disabled');
    ScenarioManager.getScenarioEditableLink(PRIVATE_SCENARIOS_LIST[0].id).should('exist');
    ScenarioManager.getRenameScenarioButton(PRIVATE_SCENARIOS_LIST[0].id).should('exist').click();
    ScenarioManager.getScenarioEditableLinkInEditMode(PRIVATE_SCENARIOS_LIST[0].id).should('exist');
  });

  it('Is shown a message error when last admin is removed', () => {
    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.removeAgent(USER_EXAMPLE.email);
    RolesEdition.getNoAdminErrorMessage().should('be.visible');
    RolesEdition.getShareDialogSubmitButton().should('be.disabled');
  });

  it('can add & remove people, and change roles in scenario sharing pop-up', () => {
    const scenario = PRIVATE_SCENARIOS_LIST[0];
    ScenarioSelector.selectScenario(scenario.name, scenario.id);

    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getShareDialogTitle().should('have.text', 'Share ' + scenario.name);
    RolesEdition.selectOptionByAgent('Workspace', ROLES.RUNNER.EDITOR);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).should('be.checked');
    RolesEdition.getShareDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.RUNNER.VALIDATOR);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VALIDATOR).should('be.checked');
    RolesEdition.getShareDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.RUNNER.ADMIN);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.ADMIN).should('be.checked');
    RolesEdition.getShareDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.RUNNER.VIEWER);

    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VIEWER).should('be.checked');

    RolesEdition.checkShareDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.RUNNER.VIEWER]);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).click();
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VIEWER).should('not.be.checked');

    RolesEdition.checkShareDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.RUNNER.EDITOR]);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VALIDATOR).click();
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).should('not.be.checked');

    RolesEdition.checkShareDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.RUNNER.VALIDATOR]);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.ADMIN).click();
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VALIDATOR).should('not.be.checked');

    RolesEdition.checkShareDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.RUNNER.ADMIN]);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VIEWER).click();
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VIEWER).should('be.checked');
    RolesEdition.getShareDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.EDITOR).click();
    RolesEdition.getShareDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[3].email);
    RolesEdition.getShareDialogRolesCheckbox(ROLES.RUNNER.VALIDATOR).click();
    RolesEdition.getShareDialogConfirmAddAccessButton().click();

    const expectedSecurity = {
      default: ROLES.RUNNER.VIEWER,
      accessControlList: [
        { id: USERS_LIST[1].email, role: ROLES.RUNNER.VIEWER },
        { id: USERS_LIST[2].email, role: ROLES.RUNNER.EDITOR },
        { id: USERS_LIST[3].email, role: ROLES.RUNNER.VALIDATOR },
      ],
    };
    RolesEdition.confirmNewPermissions(expectedSecurity);

    RolesEdition.getShareButton().click();
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[1].email).should('value', ROLES.RUNNER.VIEWER);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[2].email).should('value', ROLES.RUNNER.EDITOR);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[3].email).should('value', ROLES.RUNNER.VALIDATOR);
  });
});

describe('Check workspace permissions for Viewer, Editor & Validator', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(SHARED_SCENARIOS_LIST);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('must show a disabled button when role is Viewer', () => {
    const scenario = SHARED_SCENARIOS_LIST[0];
    ScenarioSelector.selectScenario(scenario.name, scenario.id, true);

    Scenarios.getScenarioValidateButton().should('not.exist');
    RolesEdition.getShareButton().should('be.visible').should('be.disabled');

    Scenarios.getScenarioValidateButton().should('not.exist');
    Scenarios.getScenarioRejectButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('not.exist');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getCurrencyNameInput().should('not.exist');
    BreweryParameters.getCurrencyValueInput().should('not.exist');
    BreweryParameters.switchToDatasetPartsTab();
    FileParameters.getBrowseButton(BreweryParameters.getExampleDatasetPart1()).should('not.exist');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(scenario.id);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
    ScenarioManager.getRenameScenarioButton(scenario.id).should('not.exist');
  });

  it('Check Editor permissions', () => {
    const scenario = SHARED_SCENARIOS_LIST[1];
    ScenarioSelector.selectScenario(scenario.name, scenario.id);

    RolesEdition.getShareButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getShareDialogAgentsSelect().should('not.exist');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[1].email).should('value', ROLES.RUNNER.VIEWER);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[1].email).should('eq', 'true');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[2].email).should('value', ROLES.RUNNER.EDITOR);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[2].email).should('eq', 'true');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[3].email).should('value', ROLES.RUNNER.VALIDATOR);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[3].email).should('eq', 'true');
    RolesEdition.isRoleEditorSelectorDisabled('Workspace').should('eq', 'true');
    RolesEdition.getShareDialogConfirmAddAccessButton().should('not.exist');
    RolesEdition.getShareDialogFirstCancelButton().click();

    Scenarios.getScenarioValidateButton().should('not.exist');
    Scenarios.getScenarioRejectButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(scenario.id);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
    ScenarioManager.getScenarioEditableLinkInEditMode(scenario.id).should('not.exist');
    ScenarioManager.getRenameScenarioButton(scenario.id).click();
    ScenarioManager.getScenarioEditableLinkInEditMode(scenario.id).should('exist');
  });

  it('Check Validator permissions', () => {
    const scenario = SHARED_SCENARIOS_LIST[2];
    ScenarioSelector.selectScenario(scenario.name, scenario.id);

    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(scenario.id);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
  });
});

describe('Check scenario tree when root scenarios are not shared with user', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(NO_ROOT_SCENARIOS_LIST);
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('should not crash when root scenarios are not shared', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', NO_ROOT_SCENARIOS_LIST[0].name);
  });
});
