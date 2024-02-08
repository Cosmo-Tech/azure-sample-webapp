// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

function getWorkspacesView(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.workspace.view, { timeout: timeout * 1000 });
}

function getWorkspaceCardById(workspaceId) {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceCard.replace('$WORKSPACEID', workspaceId));
}

function getNoWorkspacePlaceholder() {
  return cy.get(GENERIC_SELECTORS.workspace.noWorkspacePlaceholder);
}

function selectWorkspace(workspaceId) {
  const queries = api.interceptSelectWorkspaceQueries(workspaceId);
  getWorkspaceCardById(workspaceId).should('be.visible').find(GENERIC_SELECTORS.workspace.openButton).click();
  api.waitAliases(queries, { timeout: 60 * 1000 });
}

function getWorkspaceInfoAvatar() {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceInfoAvatar);
}

function getWorkspaceInfoPopover() {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceInfoPopover);
}

function getWorkspaceInfoName() {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceInfoName);
}

function getWorkspaceInfoDescription() {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceInfoDescription);
}

function getSwitchWorkspaceButton() {
  return cy.get(GENERIC_SELECTORS.workspace.switchWorkspaceButton);
}

function switchToWorkspaceView() {
  getWorkspaceInfoAvatar().trigger('mouseover');
  getSwitchWorkspaceButton().should('exist').click();
}

export const Workspaces = {
  getWorkspacesView,
  getWorkspaceCardById,
  getNoWorkspacePlaceholder,
  selectWorkspace,
  getWorkspaceInfoAvatar,
  getWorkspaceInfoPopover,
  getWorkspaceInfoName,
  getWorkspaceInfoDescription,
  getSwitchWorkspaceButton,
  switchToWorkspaceView,
};
