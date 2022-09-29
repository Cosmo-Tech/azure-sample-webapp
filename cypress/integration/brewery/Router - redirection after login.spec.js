import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { Login, ScenarioManager } from '../../commons/actions';
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
    Login.login(PAGE_NAME.SCENARIO_MANAGER);
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });
});
