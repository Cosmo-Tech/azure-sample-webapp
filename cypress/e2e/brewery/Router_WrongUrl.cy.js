// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ErrorBanner, Login, Workspaces } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';

describe('Sharing with wrong URL', () => {
  before(() => {
    stub.start();
  });

  after(() => {
    stub.stop();
  });

  it("can display error banner when scenario doesn't exist", () => {
    Login.login({
      url: 'W-stbbdbrwry/scenario/r-invalidurl',
      workspaceId: 'W-stbbdbrwry',
      scenarioId: 'r-invalidurl',
      expectedURL: 'W-stbbdbrwry/scenario/r-stubbedscnr01',
    });
    ErrorBanner.getErrorDetailText().contains('Scenario').contains('r-invalidurl').contains('not found');
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
