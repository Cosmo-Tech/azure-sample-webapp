import { Login, Scenarios, ScenarioParameters } from '../../commons/actions';
import { DEFAULT_SCENARIOS_LIST, USER_EXAMPLE } from '../../fixtures/stubbing/default';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

describe('check accessible features for Organization.Modeler application role as workspace admin', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      AUTHENTICATION: true,
      GET_SCENARIOS: true,
      GET_DATASETS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
      CREATE_AND_DELETE_SCENARIO: true,
    });
    stub.setFakeUser(USER_EXAMPLE);
    stub.setFakeRoles(['Organization.Modeler']);
    stub.setScenarios(DEFAULT_SCENARIOS_LIST);
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('shows create, edit, launch & validate buttons', () => {
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getParametersEditButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
  });
});

describe('check accessible features for Organization.Viewer application role as workspace admin', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      AUTHENTICATION: true,
      GET_SCENARIOS: true,
      GET_DATASETS: true,
      GET_SOLUTIONS: true,
      GET_WORKSPACES: true,
      CREATE_AND_DELETE_SCENARIO: true,
    });
    stub.setFakeUser(USER_EXAMPLE);
    stub.setFakeRoles(['Organization.Viewer']);
    stub.setScenarios(DEFAULT_SCENARIOS_LIST);
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('does not show create, edit, launch & validate buttons', () => {
    Scenarios.getScenarioValidateButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioRejectButton().should('be.visible').should('not.be.disabled');
    Scenarios.getScenarioCreationButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getParametersEditButton().should('be.visible').should('not.be.disabled');
    ScenarioParameters.getLaunchButton().should('be.visible').should('not.be.disabled');
  });
});

// TODO: stub workspace data to check with other workspace roles
// Scenarios.getScenarioValidateButton().should('not.exist');
// Scenarios.getScenarioRejectButton().should('not.exist');
// Scenarios.getScenarioCreationButton().should('be.visible').should('be.disabled');
// ScenarioParameters.getParametersEditButton().should('not.exist');
// ScenarioParameters.getLaunchButton().should('not.exist');
