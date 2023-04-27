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
import { RolesEdition } from '../../commons/actions/generic/RolesEdition';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { USER_EXAMPLE, USERS_LIST } from '../../fixtures/stubbing/default';
import {
  PRIVATE_SCENARIOS_LIST,
  SHARED_SCENARIOS_LIST,
  NO_ROOT_SCENARIOS_LIST,
  WORKSPACE_WITH_USERS_LIST,
} from '../../fixtures/stubbing/ScenarioSharing';
import { ROLES, ROLES_PERMISSIONS_MAP } from '../../commons/constants/generic/TestConstants';
import { BreweryParameters } from '../../commons/actions/brewery';

describe('Check workspace permissions for admin', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    Login.login();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(PRIVATE_SCENARIOS_LIST);
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('can create, edit, launch, validate, share, rename & delete a scenario', () => {
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).should('not.be.disabled').click();
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().should('not.be.disabled').click();
    RolesEdition.getShareScenarioDialogFirstCancelButton().click();
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(PRIVATE_SCENARIOS_LIST[0].id);
    ScenarioManager.getDeleteScenarioButton().should('be.visible').should('not.be.disabled');
    ScenarioManager.getScenarioEditableLabelInEditMode(PRIVATE_SCENARIOS_LIST[0].id).should('not.exist');
    ScenarioManager.getScenarioEditableLabel(PRIVATE_SCENARIOS_LIST[0].id).click();
    ScenarioManager.getScenarioEditableLabelInEditMode(PRIVATE_SCENARIOS_LIST[0].id).should('exist');
  });

  it('Is shown a message error when last admin is removed', () => {
    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.removeAgent(USER_EXAMPLE.email);
    RolesEdition.getNoAdminErrorMessage().should('be.visible');
    RolesEdition.getShareScenarioDialogSubmitButton().should('be.disabled');
  });

  it('can add & remove people, and change roles in scenario sharing pop-up', () => {
    const scenario = PRIVATE_SCENARIOS_LIST[0];
    ScenarioSelector.selectScenario(scenario.name, scenario.id);

    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getShareScenarioDialogTitle().should('have.text', 'Share ' + scenario.name);
    RolesEdition.selectOptionByAgent('Workspace', ROLES.SCENARIO.EDITOR);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.SCENARIO.VALIDATOR);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.SCENARIO.ADMIN);
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.ADMIN).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.selectOptionByAgent('Workspace', ROLES.SCENARIO.VIEWER);

    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('be.checked');

    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.SCENARIO.VIEWER]);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('not.be.checked');

    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.SCENARIO.EDITOR]);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).should('not.be.checked');

    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.SCENARIO.VALIDATOR]);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.ADMIN).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).should('not.be.checked');

    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(ROLES_PERMISSIONS_MAP[ROLES.SCENARIO.ADMIN]);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('be.checked');
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).click();
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[3].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).click();
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    const expectedSecurity = {
      default: ROLES.SCENARIO.VIEWER,
      accessControlList: [
        { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
        { id: USERS_LIST[2].email, role: ROLES.SCENARIO.EDITOR },
        { id: USERS_LIST[3].email, role: ROLES.SCENARIO.VALIDATOR },
      ],
    };
    RolesEdition.confirmNewPermissions(expectedSecurity);

    RolesEdition.getShareScenarioButton().click();
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[1].email).should('value', ROLES.SCENARIO.VIEWER);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[2].email).should('value', ROLES.SCENARIO.EDITOR);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[3].email).should('value', ROLES.SCENARIO.VALIDATOR);
  });
});

describe('Check workspace permissions for Viewer, Editor & Validator', () => {
  before(() => {
    stub.start();
    Login.login();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(SHARED_SCENARIOS_LIST);
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('Check Viewer permissions', () => {
    const scenario = SHARED_SCENARIOS_LIST[0];
    ScenarioSelector.selectScenario(scenario.name, scenario.id, true);

    Scenarios.getScenarioValidateButton().should('not.exist');
    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getShareScenarioDialogAgentsSelect().should('not.exist');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[1].email).should('value', ROLES.SCENARIO.VIEWER);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[1].email).should('eq', 'true');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[2].email).should('value', ROLES.SCENARIO.EDITOR);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[2].email).should('eq', 'true');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectedOptionByAgent(USERS_LIST[3].email).should('value', ROLES.SCENARIO.VALIDATOR);
    RolesEdition.isRoleEditorSelectorDisabled(USERS_LIST[3].email).should('eq', 'true');
    RolesEdition.isRoleEditorSelectorDisabled('Workspace').should('eq', 'true');
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().should('not.exist');
    RolesEdition.getShareScenarioDialogFirstCancelButton().click();

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
    ScenarioManager.getScenarioEditableLabel(scenario.id).should('not.exist');
  });

  it('Check Editor permissions', () => {
    const scenario = SHARED_SCENARIOS_LIST[1];
    ScenarioSelector.selectScenario(scenario.name, scenario.id);

    Scenarios.getScenarioValidateButton().should('not.exist');
    Scenarios.getScenarioRejectButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(scenario.id);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
    ScenarioManager.getScenarioEditableLabelInEditMode(scenario.id).should('not.exist');
    ScenarioManager.getScenarioEditableLabel(scenario.id).click();
    ScenarioManager.getScenarioEditableLabelInEditMode(scenario.id).should('exist');
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
    Login.login();
  });

  beforeEach(() => {
    stub.setFakeUser(USER_EXAMPLE);
    stub.setWorkspaces([WORKSPACE_WITH_USERS_LIST]);
    stub.setScenarios(NO_ROOT_SCENARIOS_LIST);
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('should not crash when root scenarios are not shared', () => {
    ScenarioSelector.getScenarioSelectorInput().should('have.value', NO_ROOT_SCENARIOS_LIST[0].name);
  });
});
