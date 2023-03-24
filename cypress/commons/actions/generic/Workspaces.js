// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from '../../utils';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

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

function getHomeButton() {
  return cy.get(GENERIC_SELECTORS.workspace.homeButton);
}

export const Workspaces = {
  getWorkspacesView,
  getWorkspaceCardById,
  getNoWorkspacePlaceholder,
  selectWorkspace,
  getHomeButton,
};
