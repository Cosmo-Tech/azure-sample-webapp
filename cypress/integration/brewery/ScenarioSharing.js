import { Login, Scenarios } from '../../commons/actions';
import { DEFAULT_SCENARIOS_LIST, USER_EXAMPLE } from '../../fixtures/stubbing/default';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

describe("Check permissions on someone else's scenario", () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      AUTHENTICATION: true,
      GET_SCENARIOS: true,
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

  it('check error label when scenario name field is empty', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogMasterCheckbox().click();
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().contains('empty');
  });

  it('check error label when scenario name contains invalid characters', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogNameField().type('InvalidScenarioName&');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().contains('underscores');
  });
});
