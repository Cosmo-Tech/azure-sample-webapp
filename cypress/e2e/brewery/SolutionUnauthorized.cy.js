// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Workspaces, ErrorBanner } from '../../commons/actions';
import { GENERIC_SELECTORS } from '../../commons/constants/generic/IdConstants';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';

describe('User has no access to the solution', () => {
  before(() => {
    stub.start();
  });

  after(() => {
    stub.stop();
  });

  const solutionError = {
    statusCode: 403,
    body: {
      title: 'Forbidden',
      status: 403,
      detail: `RBAC SOL-unauthorized - User does not have permission read`,
    },
  };

  // The solution interception is replaced here by a custom one because in this specific case,
  // we need to return an error instead of the base stubbed solution
  const customSelectWorkspace = (workspaceId) => {
    const queries = [apiUtils.interceptPowerBIAzureFunction(), apiUtils.interceptGetScenarios()];
    Workspaces.getWorkspaceCardById(workspaceId)
      .should('be.visible')
      .find(GENERIC_SELECTORS.workspace.openButton)
      .click();
    apiUtils.waitAliases(queries, { timeout: 60 * 1000 });
  };

  it('Redirects to workspace selector when there are several workspaces', () => {
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
    const interceptionURL = new RegExp('^' + '/.*/solutions/((sol|SOL)-[\\w]+)');
    cy.intercept({ method: 'GET', url: interceptionURL, times: 1 }, (req) => {
      req.reply(solutionError);
    });
    Login.login();
    Workspaces.getWorkspacesView().should('exist');

    customSelectWorkspace(EXTENDED_WORKSPACES_LIST[0].id);

    Workspaces.getWorkspacesView().should('exist');
    ErrorBanner.getErrorBanner().should('exist');
    ErrorBanner.getErrorCommentText().should('have.text', `You don't have permission to access this solution.`);
    ErrorBanner.getErrorDetailText().should('have.text', 'RBAC SOL-unauthorized - User does not have permission read');
    ErrorBanner.checkAnDismissErrorBanner();
    ErrorBanner.getErrorBanner().should('not.be.visible');
  });
});
