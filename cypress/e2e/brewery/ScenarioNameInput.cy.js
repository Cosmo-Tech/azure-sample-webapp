// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Scenarios } from '../../commons/actions';
import { Login } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';

describe('Check error label when invalid scenario name', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
  });
  beforeEach(() => {
    Login.login();
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
