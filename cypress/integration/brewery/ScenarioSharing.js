// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login, Scenarios, ScenarioParameters, ScenarioManager } from '../../commons/actions';
import { RolesEdition } from '../../commons/actions/generic/RolesEdition';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';
import { USER_EXAMPLE, USERS_LIST } from '../../fixtures/stubbing/default';
import {
  UNSHARED_SCENARIOS_LIST,
  SHARED_SCENARIOS_LIST,
  WORKSPACES_LIST,
} from '../../fixtures/stubbing/ScenarioSharing';
import { ROLES, PERMISSIONS } from '../../commons/constants/generic/TestConstants';

describe('Check workspace permissions for admin', () => {
  const stubbingResourcesArray = [
    { user: USER_EXAMPLE, scenarioList: UNSHARED_SCENARIOS_LIST },
    { user: USER_EXAMPLE, scenarioList: UNSHARED_SCENARIOS_LIST },
    { user: USER_EXAMPLE, scenarioList: UNSHARED_SCENARIOS_LIST },
    { user: USERS_LIST[1], scenarioList: SHARED_SCENARIOS_LIST },
    { user: USERS_LIST[2], scenarioList: SHARED_SCENARIOS_LIST },
    { user: USERS_LIST[3], scenarioList: SHARED_SCENARIOS_LIST },
  ];

  let stubbingResourcesArrayIndex = 0;

  beforeEach(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setFakeUser(stubbingResourcesArray[stubbingResourcesArrayIndex].user);
    stub.setWorkspaces(WORKSPACES_LIST);
    stub.setFakeWorkspaceId('W-stbbdbwsx1');
    stub.setScenarios(stubbingResourcesArray[stubbingResourcesArrayIndex].scenarioList);
    Login.login();
  });

  afterEach(() => {
    stub.stop();
    ++stubbingResourcesArrayIndex;
  });

  it('can create, edit, launch, validate, share, rename & delete a scenario', () => {
    // TODO: check buttons for actions described above are not disabled for an admin user
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getParametersEditButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getShareScenarioDialogAgentsSelect().should('be.visible').should('not.be.disabled');
    RolesEdition.getShareScenarioDialogFirstCancelButton().click();
    ScenarioManager.switchToScenarioManager();

    ScenarioManager.writeInFilter(UNSHARED_SCENARIOS_LIST[0].name);
    ScenarioManager.getDeleteScenarioButton().should('be.visible').should('not.be.disabled');
    ScenarioManager.getScenarioEditableLabelInEditMode(UNSHARED_SCENARIOS_LIST[0].id).should('not.exist');
    ScenarioManager.getScenarioEditableLabel(UNSHARED_SCENARIOS_LIST[0].id).click();
    ScenarioManager.getScenarioEditableLabelInEditMode(UNSHARED_SCENARIOS_LIST[0].id).should('exist');
  });

  it('is shown a message error when unauthorized changes are tried in scenario sharing pop-up', () => {
    // TODO: open share pop-up and check error messages are displayed when unauthorized changes are made:
    RolesEdition.getShareScenarioButton().should('be.visible').should('not.be.disabled').click();
    RolesEdition.getRoleEditorAgentName(USER_EXAMPLE.email).should('have.text', USER_EXAMPLE.email);
    RolesEdition.getSelectWithAction(USER_EXAMPLE.email).first().click();
    RolesEdition.getSelectActionName().click();
    RolesEdition.getNoAdminErrorMessage().should('be.visible');
    RolesEdition.getShareScenarioDialogSubmitButton().should('be.disabled');
  });

  it('can add & remove people, and change roles in scenario sharing pop-up', () => {
    // TODO: open share pop-up, make some changes (add/remove/change role + workspace default role), confirm & refresh
    // page to check changes have been made
    // For local run with stubbing, page refresh could be replaced by switching to another scenario and then switching
    // back
    const scenario = UNSHARED_SCENARIOS_LIST[0];

    const grantedPermissions = [PERMISSIONS.READ, PERMISSIONS.READ_SECURITY];
    const notGrantedPermissions = [
      PERMISSIONS.LAUNCH,
      PERMISSIONS.WRITE,
      PERMISSIONS.VALIDATE,
      PERMISSIONS.WRITE_SECURITY,
      PERMISSIONS.DELETE,
    ];

    Scenarios.selectScenario(scenario.name, scenario.id);
    RolesEdition.getShareScenarioButton().click();
    RolesEdition.getShareScenarioDialogTitle().should('have.text', 'Share ' + scenario.name);
    RolesEdition.getSelectWithAction('Workspace').click();
    RolesEdition.getSelectOption(ROLES.SCENARIO.EDITOR).click();
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.getSelectWithAction('Workspace').click();
    RolesEdition.getSelectOption(ROLES.SCENARIO.VALIDATOR).click();
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.getSelectWithAction('Workspace').click();
    RolesEdition.getSelectOption(ROLES.SCENARIO.ADMIN).click();
    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.ADMIN).should('be.checked');
    RolesEdition.getShareScenarioDialogSecondCancelButton().click();
    RolesEdition.getSelectWithAction('Workspace').click();
    RolesEdition.getSelectOption(ROLES.SCENARIO.VIEWER).click();

    RolesEdition.addAgent(USERS_LIST[1].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('be.checked');

    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(grantedPermissions, notGrantedPermissions);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('not.be.checked');
    for (let i = 0; i < 2; ++i) grantedPermissions.push(notGrantedPermissions.shift());
    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(grantedPermissions, notGrantedPermissions);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).should('not.be.checked');
    grantedPermissions.push(notGrantedPermissions.shift());
    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(grantedPermissions, notGrantedPermissions);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.ADMIN).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).should('not.be.checked');
    for (let i = 0; i < 2; ++i) grantedPermissions.push(notGrantedPermissions.shift());
    RolesEdition.checkShareScenarioDialogGrantedPermissionChip(grantedPermissions, notGrantedPermissions);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).click();
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VIEWER).should('be.checked');
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[2].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.EDITOR).click();
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    RolesEdition.addAgent(USERS_LIST[3].email);
    RolesEdition.getShareScenarioDialogRolesCheckbox(ROLES.SCENARIO.VALIDATOR).click();
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().click();

    const expectedNewPermissions = {
      ACLSecurity: [
        { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
        { id: USERS_LIST[2].email, role: ROLES.SCENARIO.EDITOR },
        { id: USERS_LIST[3].email, role: ROLES.SCENARIO.VALIDATOR },
      ],
    };
    RolesEdition.confirmNewPermissions(expectedNewPermissions);

    RolesEdition.getShareScenarioButton().click();
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectWithAction(USERS_LIST[1].email).find('input').should('value', ROLES.SCENARIO.VIEWER);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectWithAction(USERS_LIST[2].email).find('input').should('value', ROLES.SCENARIO.EDITOR);
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectWithAction(USERS_LIST[3].email).find('input').should('value', ROLES.SCENARIO.VALIDATOR);
  });

  it('Check Viewer permissions', () => {
    Scenarios.getScenarioValidateButton().should('not.exist');

    RolesEdition.getShareScenarioButton().click();
    RolesEdition.getShareScenarioDialogAgentsSelect().should('not.exist');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[1].email).should('have.text', USERS_LIST[1].email);
    RolesEdition.getSelectWithAction(USERS_LIST[1].email).find('input').should('value', ROLES.SCENARIO.VIEWER);
    RolesEdition.getSelectWithAction(USERS_LIST[1].email).find('div').should('have.attr', 'aria-disabled');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[2].email).should('have.text', USERS_LIST[2].email);
    RolesEdition.getSelectWithAction(USERS_LIST[2].email).find('input').should('value', ROLES.SCENARIO.EDITOR);
    RolesEdition.getSelectWithAction(USERS_LIST[2].email).find('div').should('have.attr', 'aria-disabled');
    RolesEdition.getRoleEditorAgentName(USERS_LIST[3].email).should('have.text', USERS_LIST[3].email);
    RolesEdition.getSelectWithAction(USERS_LIST[3].email).find('input').should('value', ROLES.SCENARIO.VALIDATOR);
    RolesEdition.getSelectWithAction(USERS_LIST[3].email).find('div').should('have.attr', 'aria-disabled');
    RolesEdition.getSelectWithAction('Workspace').find('div').should('have.attr', 'aria-disabled');
    RolesEdition.getShareScenarioDialogConfirmAddAccessButton().should('not.exist');
    RolesEdition.getShareScenarioDialogFirstCancelButton().click();

    Scenarios.getScenarioValidateButton().should('not.exist');
    Scenarios.getScenarioRejectButton().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
    ScenarioParameters.getParametersEditButton().should('not.exist');
    ScenarioParameters.getLaunchButton().should('not.exist');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(UNSHARED_SCENARIOS_LIST[0].name);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
    ScenarioManager.getScenarioEditableLabel(UNSHARED_SCENARIOS_LIST[0].id).should('not.exist');
  });

  it('Check Editor permissions', () => {
    Scenarios.getScenarioValidateButton().should('not.exist');
    Scenarios.getScenarioRejectButton().should('not.exist');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
    ScenarioParameters.getParametersEditButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(UNSHARED_SCENARIOS_LIST[0].name);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
    ScenarioManager.getScenarioEditableLabelInEditMode(UNSHARED_SCENARIOS_LIST[0].id).should('not.exist');
    ScenarioManager.getScenarioEditableLabel(UNSHARED_SCENARIOS_LIST[0].id).click();
    ScenarioManager.getScenarioEditableLabelInEditMode(UNSHARED_SCENARIOS_LIST[0].id).should('exist');
  });

  it('Check Validator permissions', () => {
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
    ScenarioParameters.getParametersEditButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.writeInFilter(UNSHARED_SCENARIOS_LIST[0].name);
    ScenarioManager.getDeleteScenarioButton().should('not.exist');
  });
});
