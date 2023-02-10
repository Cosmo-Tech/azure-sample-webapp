// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { BREWERY_WORKSPACE_ID } from '../../constants/generic/TestConstants';

function getWorkspacesView(timeout = 1000) {
  return cy.get(GENERIC_SELECTORS.workspace.view, { timeout });
}

function getWorkspaceCardById(workspaceId) {
  return cy.get(GENERIC_SELECTORS.workspace.workspaceCard.replace('$WORKSPACEID', workspaceId));
}

function getNoWorkspacePlaceholder() {
  return cy.get(GENERIC_SELECTORS.workspace.noWorkspacePlaceholder);
}

function selectWorkspace(workspaceId) {
  getWorkspaceCardById(workspaceId).should('be.visible').find(GENERIC_SELECTORS.workspace.openButton).click();
}

function selectDefaultWorkspace() {
  selectWorkspace(BREWERY_WORKSPACE_ID);
}

function getHomeButton() {
  return cy.get(GENERIC_SELECTORS.workspace.homeButton);
}

export const Workspaces = {
  getWorkspacesView,
  getWorkspaceCardById,
  getNoWorkspacePlaceholder,
  selectWorkspace,
  selectDefaultWorkspace,
  getHomeButton,
};
