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
function getShareScenarioDialogAgentsSelectAgentName(agentName) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogAgentsSelectAgentName.replace(
      '$AGENT_NAME',
      getIdentifierFromUserEmail(agentName)
    )
  );
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

function confirmNewPermissions(expectedSecurity) {
  const expecteSecurityDefault = expectedSecurity?.default;
  const expectedSecurityAccessControlList = expectedSecurity?.accessControlList;

  expectedSecurityAccessControlList
    .sort((userA, userB) => {
      if (getIdentifierFromUserEmail(userA.id) < getIdentifierFromUserEmail(userB.id)) return -1;
      if (getIdentifierFromUserEmail(userA.id) > getIdentifierFromUserEmail(userB.id)) return 1;
      return 0;
    })
    .reverse();

  let updateScenarioDefaultSecurityAlias;
  let interceptUpdateScenarioACLSecurityAlias = [];

  if (expecteSecurityDefault) {
    updateScenarioDefaultSecurityAlias = api.interceptUpdateScenarioDefaultSecurity(expecteSecurityDefault);
  }

  interceptUpdateScenarioACLSecurityAlias = expectedSecurityAccessControlList.map((userSecurity) => {
    return api.interceptUpdateScenarioACLSecurity(userSecurity);
  });

  getShareScenarioDialogSubmitButton().click();

  if (expecteSecurityDefault) api.waitAlias(updateScenarioDefaultSecurityAlias);
  api.waitAliases(interceptUpdateScenarioACLSecurityAlias);
}

function getIdentifierFromUserEmail(userNAme) {
  return userNAme.replace(/[@.]/g, '');
}

function writeInAgentSelectorInput(searchStr) {
  return getShareScenarioDialogAgentsSelect()
    .click()
    .should('not.be.disabled')
    .type('{selectAll}{backspace}' + searchStr);
}
function addAgent(agentName) {
  writeInAgentSelectorInput(agentName);
  getShareScenarioDialogAgentsSelectAgentName(agentName).should('be.visible').should('not.be.disabled');
  getShareScenarioDialogAgentsSelectAgentName(agentName).click();
}
function removeAgent(agentName) {
  getSelectWithActionByAgent(agentName).click();
  selectAction().click();
  getRoleEditorByAgent(agentName).should('not.exist');
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
function checkShareScenarioDialogGrantedPermissionChip(permissions) {
  permissions.granted.forEach((permission) => {
    getShareScenarioDialogGrantedPermissionChip(permission).should('be.visible');
  });
  permissions.notGranted.forEach((permission) => {
    getShareScenarioDialogNotGrantedPermissionChip(permission).should('be.visible');
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
      getIdentifierFromUserEmail(agentName)
    )
  );
}
function selectOptionByAgent(agentName, option) {
  getSelectWithActionByAgent(agentName).click();
  selectOption(option);
}
function getRoleEditorAgentName(agentName) {
  return getRoleEditorByAgent(agentName).find(GENERIC_SELECTORS.genericComponents.rolesEdition.roleEditorAgentName);
}

function getSelectedOptionByAgent(agentName) {
  return getSelectWithActionByAgent(agentName).find('input');
}
function isRoleEditorSelectorDisabled(agentName) {
  return getRoleEditorByAgent(agentName)
    .find(GENERIC_SELECTORS.genericComponents.rolesEdition.selectWithAction)
    .find('div')
    .invoke('attr', 'aria-disabled');
}

function getSelectCheckedIcon(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectCheckedIconByOption);
}
function getSelectWithActionByAgent(agentName) {
  return getRoleEditorByAgent(agentName).find(GENERIC_SELECTORS.genericComponents.rolesEdition.selectWithAction);
}
function selectOption(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectOption.replace('$OPTION', option)).click();
}
function selectAction() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectActionName);
}
function getNoAdminErrorMessage() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.noAdminErrorMessage);
}
export const RolesEdition = {
  getShareScenarioButton,
  getShareScenarioDialogAgentsSelect,
  getShareScenarioDialogAgentsSelectAgentName,
  getShareScenarioDialogFirstCancelButton,
  getShareScenarioDialogSubmitButton,
  getShareScenarioDialog,
  getShareScenarioDialogTitle,
  confirmNewPermissions,
  getIdentifierFromUserEmail,
  writeInAgentSelectorInput,
  addAgent,
  removeAgent,
  getShareScenarioDialogDisabledAgentsSelect,
  getShareScenarioDialogRolesCheckbox,
  getShareScenarioDialogGrantedPermissionChip,
  getShareScenarioDialogNotGrantedPermissionChip,
  checkShareScenarioDialogGrantedPermissionChip,
  getShareScenarioDialogSecondCancelButton,
  getShareScenarioDialogConfirmAddAccessButton,
  getRoleEditorByAgent,
  selectOptionByAgent,
  getRoleEditorAgentName,
  getSelectedOptionByAgent,
  isRoleEditorSelectorDisabled,
  getSelectCheckedIcon,
  getSelectWithActionByAgent,
  selectOption,
  selectAction,
  getNoAdminErrorMessage,
};
