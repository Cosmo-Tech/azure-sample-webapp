// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

function getShareScenarioButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioButton);
}
function getShareScenarioDialogAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogAgentsSelect);
}
function getShareScenarioDialogFirstCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogFirstCancelButton);
}
function getShareScenarioDialogSubmitButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogSubmitButton);
}
function getShareScenarioDialog() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialog);
}
function getShareScenarioDialogTitle() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogTitle);
}

function confirmNewPermissions(expectedNewPermissions) {
  const expectedDefaultSecurity = expectedNewPermissions?.defaultSecurity;
  const expextedACLSecurity = expectedNewPermissions?.ACLSecurity;
  expextedACLSecurity.sort((userA, userB) => userA.mail > userB.mail);

  let updateScenarioDefaultSecurityAlias;
  let interceptUpdateScenarioACLSecurityAlias = [];

  if (expectedDefaultSecurity)
    updateScenarioDefaultSecurityAlias = api.interceptUpdateScenarioDefaultSecurity(expectedDefaultSecurity);
  interceptUpdateScenarioACLSecurityAlias = expextedACLSecurity.map((userSecurity) => {
    return api.interceptUpdateScenarioACLSecurity(userSecurity);
  });

  getShareScenarioDialogSubmitButton().click();

  if (expectedDefaultSecurity) api.waitAlias(updateScenarioDefaultSecurityAlias);
  if (interceptUpdateScenarioACLSecurityAlias?.length > 0) {
    interceptUpdateScenarioACLSecurityAlias.forEach((alias) => {
      api.waitAlias(alias);
    });
  }
}

function addAgent(agent) {
  getShareScenarioDialogAgentsSelect()
    .click()
    .should('not.be.disabled')
    .type('{selectAll}{backspace}' + agent + '{downArrow}{enter}');
  RolesEdition.getShareScenarioDialogDisabledAgentsSelect().should('be.visible').find('input').should('value', agent);
}

function getShareScenarioDialogDisabledAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogDisabledAgentsSelect);
}
function getShareScenarioDialogRolesCheckbox(role) {
  return cy
    .get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogRolesCheckboxByRole.replace('$ROLE', role))
    .find('input');
}
function getShareScenarioDialogGrantedPermissionChip(permission) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogGrantedPermissionChipByPermission.replace(
      '$PERMISSION',
      permission
    )
  );
}
function getShareScenarioDialogNotGrantedPermissionChip(permission) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogNotGrantedPermissionChipByPermission.replace(
      '$PERMISSION',
      permission
    )
  );
}
function checkShareScenarioDialogGrantedPermissionChip(grantedPermissions, notGrantedPermissions) {
  grantedPermissions.forEach((permission) => {
    RolesEdition.getShareScenarioDialogGrantedPermissionChip(permission).should('be.visible');
  });
  notGrantedPermissions.forEach((permission) => {
    RolesEdition.getShareScenarioDialogNotGrantedPermissionChip(permission).should('be.visible');
  });
}

function getShareScenarioDialogSecondCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogSecondCancelButton);
}
function getShareScenarioDialogConfirmAddAccessButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogConfirmAddAccessButton);
}

function getRoleEditorByAgent(agentName) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.roleEditorByAgent.replace(
      '$AGENT_NAME',
      agentName.replaceAll(/[@.]/g, '')
    )
  );
}
function getRoleEditorAgentName(agentName) {
  return getRoleEditorByAgent(agentName).find(GENERIC_SELECTORS.genericComponents.rolesEdition.roleEditorAgentName);
}

function getSelectWithAction(agentName) {
  return getRoleEditorByAgent(agentName).find(GENERIC_SELECTORS.genericComponents.rolesEdition.selectWithAction);
}
function getSelectCheckedIcon(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectCheckedIconByOption);
}
function getSelectOption(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectOptionByOption.replace('$OPTION', option));
}
function getSelectActionName() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectActionName);
}
function getNoAdminErrorMessage() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.noAdminErrorMessage);
}
export const RolesEdition = {
  getShareScenarioButton,
  getShareScenarioDialogAgentsSelect,
  getShareScenarioDialogFirstCancelButton,
  getShareScenarioDialogSubmitButton,
  getShareScenarioDialog,
  getShareScenarioDialogTitle,
  confirmNewPermissions,
  addAgent,
  getShareScenarioDialogDisabledAgentsSelect,
  getShareScenarioDialogRolesCheckbox,
  getShareScenarioDialogGrantedPermissionChip,
  getShareScenarioDialogNotGrantedPermissionChip,
  checkShareScenarioDialogGrantedPermissionChip,
  getShareScenarioDialogSecondCancelButton,
  getShareScenarioDialogConfirmAddAccessButton,
  getRoleEditorByAgent,
  getRoleEditorAgentName,
  getSelectWithAction,
  getSelectCheckedIcon,
  getSelectOption,
  getSelectActionName,
  getNoAdminErrorMessage,
};
