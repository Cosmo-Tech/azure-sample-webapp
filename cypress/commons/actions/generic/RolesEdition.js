// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

function getShareScenarioButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioButton);
}
function getShareButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareButton);
}

function getShareScenarioDialogAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogAgentsSelect);
}
function getShareDialogAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogAgentsSelect);
}

function getShareScenarioDialogAgentsSelectAgentName(agentName) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogAgentsSelectAgentName.replace(
      '$AGENT_NAME',
      getIdentifierFromUserEmail(agentName)
    )
  );
}
function getShareDialogAgentsSelectAgentName(agentName) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogAgentsSelectAgentName.replace(
      '$AGENT_NAME',
      getIdentifierFromUserEmail(agentName)
    )
  );
}

function getShareScenarioDialogFirstCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogFirstCancelButton);
}
function getShareDialogFirstCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogFirstCancelButton);
}

function getShareScenarioDialog() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialog);
}
function getShareDialog() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialog);
}

function getShareScenarioDialogTitle() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogTitle);
}
function getShareDialogTitle() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogTitle);
}

function getShareScenarioDialogSubmitButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogSubmitButton);
}

function getShareDialogSubmitButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogSubmitButton);
}

function forgeExpectedSecurityAccessControlList(accessControlList) {
  return accessControlList
    .sort((userA, userB) => {
      if (getIdentifierFromUserEmail(userA.id) < getIdentifierFromUserEmail(userB.id)) return -1;
      if (getIdentifierFromUserEmail(userA.id) > getIdentifierFromUserEmail(userB.id)) return 1;
      return 0;
    })
    .reverse();
}

function confirmNewPermissions(expectedSecurity) {
  const expectedSecurityDefault = expectedSecurity?.default;
  const expectedSecurityAccessControlList = forgeExpectedSecurityAccessControlList(expectedSecurity?.accessControlList);

  let updateScenarioDefaultSecurityAlias;
  let interceptUpdateScenarioACLSecurityAlias = [];

  if (expectedSecurityDefault) {
    updateScenarioDefaultSecurityAlias = api.interceptUpdateScenarioDefaultSecurity(expectedSecurityDefault);
  }

  interceptUpdateScenarioACLSecurityAlias = expectedSecurityAccessControlList.map((userSecurity) => {
    return api.interceptUpdateScenarioACLSecurity(userSecurity);
  });

  getShareDialogSubmitButton().click();

  if (expectedSecurityDefault) api.waitAlias(updateScenarioDefaultSecurityAlias);
  api.waitAliases(interceptUpdateScenarioACLSecurityAlias);
}

function confirmDatasetNewPermissions(expectedSecurity, isRunner = false) {
  const expectedSecurityDefault = expectedSecurity?.default;
  const expectedSecurityAccessControlList = forgeExpectedSecurityAccessControlList(expectedSecurity?.accessControlList);

  let updateDatasetDefaultSecurityAlias;
  const interceptUpdateDatasetACLSecurityAlias = [];
  const interceptUpdateRunnerACLSecurityAlias = [];

  if (expectedSecurityDefault) {
    updateDatasetDefaultSecurityAlias = api.interceptUpdateDatasetDefaultSecurity(expectedSecurityDefault);
    if (isRunner) updateDatasetDefaultSecurityAlias = api.interceptUpdateRunnerDefaultSecurity(expectedSecurityDefault);
  }

  expectedSecurityAccessControlList.forEach((userSecurity) => {
    interceptUpdateDatasetACLSecurityAlias.push(api.interceptUpdateDatasetACLSecurity(userSecurity));
    interceptUpdateRunnerACLSecurityAlias.push(api.interceptUpdateRunnerACLSecurity(userSecurity));
  });

  getShareDialogSubmitButton().click();

  if (expectedSecurityDefault) {
    api.waitAlias(updateDatasetDefaultSecurityAlias);
    if (isRunner) updateDatasetDefaultSecurityAlias = api.interceptUpdateRunnerDefaultSecurity(expectedSecurityDefault);
  }
  api.waitAliases(interceptUpdateDatasetACLSecurityAlias);
  if (isRunner) api.waitAliases(interceptUpdateRunnerACLSecurityAlias);
}

function getIdentifierFromUserEmail(userName) {
  return userName.replace(/[@.]/g, '');
}

function writeInAgentSelectorInput(searchStr) {
  return getShareDialogAgentsSelect()
    .click()
    .should('not.be.disabled')
    .type('{selectAll}{backspace}' + searchStr);
}
function addAgent(agentName) {
  writeInAgentSelectorInput(agentName);
  getShareDialogAgentsSelectAgentName(agentName).should('be.visible').should('not.be.disabled');
  getShareDialogAgentsSelectAgentName(agentName).click();
}
function removeAgent(agentName) {
  getSelectWithActionByAgent(agentName).click();
  selectAction().click();
  getRoleEditorByAgent(agentName).should('not.exist');
}

function getShareScenarioDialogDisabledAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogDisabledAgentsSelect);
}
function getShareDialogDisabledAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogDisabledAgentsSelect);
}

function getShareScenarioDialogRolesCheckbox(role) {
  return cy
    .get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogRolesCheckboxByRole.replace('$ROLE', role))
    .find('input');
}
function getShareDialogRolesCheckbox(role) {
  return cy
    .get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogRolesCheckboxByRole.replace('$ROLE', role))
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
function getShareDialogGrantedPermissionChip(permission) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogGrantedPermissionChipByPermission.replace(
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
function getShareDialogNotGrantedPermissionChip(permission) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogNotGrantedPermissionChipByPermission.replace(
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
function checkShareDialogGrantedPermissionChip(permissions) {
  permissions.granted.forEach((permission) => {
    getShareDialogGrantedPermissionChip(permission).should('be.visible');
  });
  permissions.notGranted.forEach((permission) => {
    getShareDialogNotGrantedPermissionChip(permission).should('be.visible');
  });
}

function getShareScenarioDialogSecondCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogSecondCancelButton);
}
function getShareDialogSecondCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogSecondCancelButton);
}

function getShareScenarioDialogConfirmAddAccessButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogConfirmAddAccessButton);
}
function getShareDialogConfirmAddAccessButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareDialogConfirmAddAccessButton);
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
function getGeneralAccess() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.generalAccess);
}
export const RolesEdition = {
  getShareScenarioButton,
  getShareButton,
  getShareScenarioDialogAgentsSelect,
  getShareDialogAgentsSelect,
  getShareScenarioDialogAgentsSelectAgentName,
  getShareDialogAgentsSelectAgentName,
  getShareScenarioDialogFirstCancelButton,
  getShareDialogFirstCancelButton,
  getShareScenarioDialog,
  getShareDialog,
  getShareScenarioDialogTitle,
  getShareDialogTitle,
  getShareScenarioDialogSubmitButton,
  getShareDialogSubmitButton,
  confirmNewPermissions,
  confirmDatasetNewPermissions,
  getIdentifierFromUserEmail,
  writeInAgentSelectorInput,
  addAgent,
  removeAgent,
  getShareScenarioDialogDisabledAgentsSelect,
  getShareDialogDisabledAgentsSelect,
  getShareScenarioDialogRolesCheckbox,
  getShareDialogRolesCheckbox,
  checkShareScenarioDialogGrantedPermissionChip,
  getShareDialogGrantedPermissionChip,
  getShareDialogNotGrantedPermissionChip,
  checkShareDialogGrantedPermissionChip,
  getShareScenarioDialogSecondCancelButton,
  getShareDialogSecondCancelButton,
  getShareScenarioDialogConfirmAddAccessButton,
  getShareDialogConfirmAddAccessButton,
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
  getGeneralAccess,
};
