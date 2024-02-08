// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';

describe("User doesn't access SignIn and AccessDenied pages if authenticated or authorized", () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
    });
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('redirects to scenario view if user is authenticated and authorized', () => {
    route.browse({ url: 'sign-in', expectedURL: '/scenario' });
    Scenarios.getScenarioView().should('be.visible');
    route.browse({ url: 'accessDenied', expectedURL: '/scenario' });
    Scenarios.getScenarioView().should('be.visible');
  });
});
