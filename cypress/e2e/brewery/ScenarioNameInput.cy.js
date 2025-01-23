// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';

describe('Check valid and invalid scenario name', () => {
  before(() => stub.start());
  beforeEach(() => Login.login());

  it('check error label when scenario name field is empty', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogMasterCheckbox().click();
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('be.visible');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().contains('empty');
  });

  it('must accept special characters and unicode', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogNameField().type('🚀*valid_Scenario-Name&');
    Scenarios.getScenarioCreationDialogNameInputErrorLabel().should('not.exist');
  });
});
