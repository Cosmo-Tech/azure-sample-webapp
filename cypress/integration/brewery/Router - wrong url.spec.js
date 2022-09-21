import { ErrorBanner, Login } from '../../commons/actions';
import { apiUtils as api } from '../../commons/utils';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';

describe('Sharing with wrong URL', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
  });
  after(() => {
    stub.stop();
  });
  it("can display error banner when scenario doesn't exist", () => {
    cy.clearLocalStorageSnapshot();
    cy.visit('scenario/invalidurl');
    const reqGetScenarioAlias = api.interceptGetScenario('invalidurl');
    const reqPowerBIAlias = api.interceptPowerBIAzureFunction();
    const reqGetScenariosAlias = api.interceptGetScenarios();
    const reqGetDatasetsAlias = api.interceptGetDatasets();
    Login.getMicrosoftLoginButton().click();
    api.waitAlias(reqGetScenarioAlias);
    api.waitAlias(reqGetDatasetsAlias);
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
