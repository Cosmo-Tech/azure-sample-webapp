// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ErrorBanner, Login, Workspaces } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';

describe('Sharing with wrong URL', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
    });
  });

  after(() => {
    stub.stop();
  });

  it("can display error banner when scenario doesn't exist", () => {
    Login.login({
      url: 'W-stbbdbrwry/scenario/s-invalidurl',
      workspaceId: 'W-stbbdbrwry',
      scenarioId: 's-invalidurl',
      expectedURL: 'W-stbbdbrwry/scenario/s-stubbedscnr01',
    });
    ErrorBanner.getErrorDetailText().contains('Scenario').contains('s-invalidurl').contains('not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.checkAnDismissErrorBanner();
  });

  it('redirects to workspaces view if url contains wrong workspaceId', () => {
    Login.login({
      url: 'invalidworkspaceId/scenario/s-invalidurl',
      expectedURL: '/workspaces',
      workspaceId: null,
      scenarioId: null,
    });
    ErrorBanner.getErrorDetailText().contains('Could not find workspace with id invalidworkspaceId');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.checkAnDismissErrorBanner();
    Workspaces.getWorkspaceCardById('W-stbbdbrwry').should('be.visible');
  });
});
