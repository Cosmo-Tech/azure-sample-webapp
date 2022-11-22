import { ErrorBanner, Login } from '../../commons/actions';
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
  beforeEach(() => {
    stub.setFakeWorkspaceId('W-stbbdbrwry');
  });
  after(() => {
    stub.stop();
  });
  it("can display error banner when scenario doesn't exist", () => {
    Login.login('W-stbbdbrwry/scenario/s-invalidurl');
    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Scenario #s-invalidurl not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
  });
});
