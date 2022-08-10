import { PAGE_NAME, URL_POWERBI, URL_REGEX } from '../../commons/constants/generic/TestConstants';
import { Login, ScenarioManager } from '../../commons/actions';

describe('redirection after login', () => {
  it('redirects to scenario manager view after login', () => {
    cy.clearLocalStorageSnapshot();
    cy.visit(PAGE_NAME.SCENARIO_MANAGER);

    // Stub PowerBi request
    cy.intercept('GET', URL_POWERBI, {
      statusCode: 200,
    });

    const reqName = 'requestLoginGetScenario_1';
    cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as(reqName);
    Login.getMicrosoftLoginButton().click();
    cy.wait('@' + reqName);

    ScenarioManager.getScenarioManagerView().should('be.visible');
    cy.saveLocalStorage();
  });
});
