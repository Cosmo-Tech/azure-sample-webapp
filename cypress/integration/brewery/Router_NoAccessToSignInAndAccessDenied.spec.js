import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { Login, Scenarios } from '../../commons/actions';
import { routeUtils as route } from '../../commons/utils';

describe("User doesn't access SignIn and AccessDenied pages if authenticated or authorized", () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
    });
    Login.login();
  });
  after(() => {
    stub.stop();
  });
  it('redirects to scenario view if user is authenticated and authorized', () => {
    route.browse('sign-in', '/scenario');
    Scenarios.getScenarioView().should('be.visible');
    route.browse('accessDenied', '/scenario');
    Scenarios.getScenarioView().should('be.visible');
  });
});
