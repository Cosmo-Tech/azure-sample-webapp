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
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('have.text', 'Scenario name cannot be empty');
  });

  it('check error label when scenario name contains invalid characters', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogNameField().type('InvalidScenarioName&');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should(
      'have.text',
      'Scenario name has to start with a letter or a digit, and can only ' +
        'contain letters, digits, spaces, underscores, hyphens and dots.'
    );
  });
});
