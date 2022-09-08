import { ErrorBanner, Login } from '../../commons/actions';
import { apiUtils as api } from '../../commons/utils';

describe('Sharing with wrong URL', () => {
  it("can display error banner when scenario doesn't exist", () => {
    cy.clearLocalStorageSnapshot();
    cy.visit('scenario/invalidurl');

    const reqPowerBIAlias = api.interceptPowerBIAzureFunction();
    const reqGetScenariosAlias = api.interceptGetScenarios();
    Login.getMicrosoftLoginButton().click();
    api.waitAlias(reqGetScenariosAlias, { timeout: 60 * 1000 });
    api.waitAlias(reqPowerBIAlias);

    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Scenario #invalidurl not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
    cy.saveLocalStorage();
  });
});
