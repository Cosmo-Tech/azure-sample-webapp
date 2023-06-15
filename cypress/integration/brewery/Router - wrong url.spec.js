import { ErrorBanner, Login } from '../../commons/actions';
import { URL_POWERBI, URL_REGEX } from '../../commons/constants/generic/TestConstants';
describe('Sharing with wrong URL', () => {
  it("can display error banner when scenario doesn't exist", () => {
    cy.clearLocalStorageSnapshot();
    cy.visit('scenario/invalidurl');

    // Stub PowerBi request
    cy.intercept('GET', URL_POWERBI, {
      statusCode: 200,
    });

    const reqName = 'requestLoginGetScenario_1';
    cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as(reqName);
    Login.getMicrosoftLoginButton().click();
    cy.wait('@' + reqName);

    ErrorBanner.getErrorBanner().should('be.visible');
    ErrorBanner.getErrorDetailText().contains('Scenario').contains('invalidurl').contains('not found');
    ErrorBanner.getErrorCommentText().contains('You have been redirected');
    ErrorBanner.getDismissErrorButton().click();
    ErrorBanner.getErrorBanner().should('not.exist');
    cy.saveLocalStorage();
  });
});
