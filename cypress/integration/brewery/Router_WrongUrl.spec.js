import { ErrorBanner, Login } from '../../commons/actions';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { apiUtils as api } from '../../commons/utils';
import { GENERIC_SELECTORS } from '../../commons/constants/generic/IdConstants';

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
    Login.login('W-stbbdbrwry/scenario/s-invalidurl');
    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Scenario #s-invalidurl not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
  });

  it('redirects to access denied view if url contains wrong workspaceId', () => {
    const reqAuthAlias = api.interceptAuthentication();
    cy.clearLocalStorageSnapshot();
    cy.visit('wrongworkspaceid/scenario/s-invalidurl');
    cy.get(GENERIC_SELECTORS.login.microsoftLoginButton).click();
    api.waitAlias(reqAuthAlias);
    cy.url({ timeout: 10000 }).should('include', '/accessDenied');
    cy.get(GENERIC_SELECTORS.accessDenied.errorMessage).contains(
      'Could not find workspace with id wrongworkspaceid in workspaces list'
    );
  });
});
