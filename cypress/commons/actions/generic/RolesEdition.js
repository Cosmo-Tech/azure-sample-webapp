// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

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

function getShareScenarioDialogDisabledAgentsSelect() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogDisabledAgentsSelect);
}
function getShareScenarioDialogRolesCheckbox(role) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogRolesCheckboxByRole);
}
function getShareScenarioDialogGrantedPermissionChip(permission) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogGrantedPermissionChipByPermission);
}
function getShareScenarioDialogNotGrantedPermissionChip(permission) {
  return cy.get(
    GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogNotGrantedPermissionChipByPermission
  );
}
function getShareScenarioDialogSecondCancelButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogSecondCancelButton);
}
function getShareScenarioDialogConfirmAddAccessButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareScenarioDialogConfirmAddAccessButton);
}

function getRoleEditorAgent() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.roleEditorAgent);
}
function getSelectWithAction() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectWithAction);
}
function getSelectCheckedIcon(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectCheckedIconByOption);
}
function getSelectOption(option) {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectOptionByOption);
}
function getSelectActionName() {
  return cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.selectActionName);
}

export const RolesEdition = {
  getShareScenarioButton,
  getShareScenarioDialogAgentsSelect,
  getShareScenarioDialogFirstCancelButton,
  getShareScenarioDialogSubmitButton,
  getShareScenarioDialog,
  getShareScenarioDialogTitle,
  getShareScenarioDialogDisabledAgentsSelect,
  getShareScenarioDialogRolesCheckbox,
  getShareScenarioDialogGrantedPermissionChip,
  getShareScenarioDialogNotGrantedPermissionChip,
  getShareScenarioDialogSecondCancelButton,
  getShareScenarioDialogConfirmAddAccessButton,
  getRoleEditorAgent,
  getSelectWithAction,
  getSelectCheckedIcon,
  getSelectOption,
  getSelectActionName,
};
