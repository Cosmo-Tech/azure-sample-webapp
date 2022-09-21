import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { Login, ScenarioManager } from '../../commons/actions';
import { apiUtils as api } from '../../commons/utils';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';

describe('redirection after login', () => {
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
  it('redirects to scenario manager view after login', () => {
    cy.clearLocalStorageSnapshot();
    cy.visit(PAGE_NAME.SCENARIO_MANAGER);

    const reqPowerBIAlias = api.interceptPowerBIAzureFunction();
    const reqGetScenariosAlias = api.interceptGetScenarios();
    const reqGetDatasetsAlias = api.interceptGetDatasets();
    Login.getMicrosoftLoginButton().click();
    api.waitAlias(reqGetDatasetsAlias);
    api.waitAlias(reqGetScenariosAlias, { timeout: 60 * 1000 });
    api.waitAlias(reqPowerBIAlias);
    ScenarioManager.getScenarioManagerView().should('be.visible');
    cy.saveLocalStorage();
  });
});
