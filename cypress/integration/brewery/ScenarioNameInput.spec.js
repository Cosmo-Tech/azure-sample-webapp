import { Login, Scenarios } from '../../commons/actions';

describe('Check error label when invalid scenario name', () => {
  before(() => {
    Login.login();
  });
  beforeEach(() => {
    Login.relogin();
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
