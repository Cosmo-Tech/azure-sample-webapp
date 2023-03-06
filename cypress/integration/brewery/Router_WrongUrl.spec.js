import { ErrorBanner, Login, Workspaces } from '../../commons/actions';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';

describe('Sharing with wrong URL', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_SOLUTIONS: true,
    });
  });

  after(() => {
    stub.stop();
  });

  it("can display error banner when scenario doesn't exist", () => {
    Login.login({ url: 'W-stbbdbrwry/scenario/s-invalidurl', expectedURL: 'W-stbbdbrwry/scenario/s-stubbedscnr01' });
    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Scenario #s-invalidurl not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
  });

  it('redirects to workspaces view if url contains wrong workspaceId', () => {
    Login.login({
      url: 'invalidworkspaceId/scenario/s-invalidurl',
      expectedURL: '/workspaces',
      workspaceId: null,
      scenarioId: null,
    });
    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Could not find workspace with id invalidworkspaceId');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
    Workspaces.getWorkspaceCardById('W-stbbdbrwry').should('be.visible');
  });
});
