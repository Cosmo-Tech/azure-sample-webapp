import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { Login, ScenarioManager } from '../../commons/actions';
import { apiUtils as api } from '../../commons/utils';

describe('redirection after login', () => {
  it('redirects to scenario manager view after login', () => {
    cy.clearLocalStorageSnapshot();
    cy.visit(PAGE_NAME.SCENARIO_MANAGER);

    const reqPowerBIAlias = api.interceptPowerBIAzureFunction();
    const reqGetScenariosAlias = api.interceptGetScenarios();
    Login.getMicrosoftLoginButton().click();
    api.waitAlias(reqGetScenariosAlias, { timeout: 60 * 1000 });
    api.waitAlias(reqPowerBIAlias);
    ScenarioManager.getScenarioManagerView().should('be.visible');
    cy.saveLocalStorage();
  });
});
