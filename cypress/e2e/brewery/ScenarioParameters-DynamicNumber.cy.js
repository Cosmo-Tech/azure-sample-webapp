// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, Scenarios } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  TWINGRAPH_DATASET_LIST,
  SCENARIOS_WITH_DYNAMIC_NUMBERS,
  SOLUTION_WITH_DYNAMIC_PARAMETERS,
  WORKSPACE_LIST_WITH_TWINGRAPH_DATASET,
} from '../../fixtures/stubbing/ScenarioParameters';

describe('dynamic value for number input', () => {
  before(() => {
    stub.start();
    stub.setDatasets(TWINGRAPH_DATASET_LIST);
    stub.setWorkspaces(WORKSPACE_LIST_WITH_TWINGRAPH_DATASET);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_PARAMETERS]);
    stub.setScenarios(SCENARIOS_WITH_DYNAMIC_NUMBERS);
  });
  beforeEach(() => {
    apiUtils.interceptPostDatasetTwingraphQuery(
      { body: 'stock\n10', headers: { 'content-type': 'text/csv' } },
      false,
      0
    );
    Login.login();
  });
  after(stub.stop);

  it('can display parameters with dynamic values', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_int').should('have.value', 10);
    apiUtils.interceptPostDatasetTwingraphQuery(
      { body: 'restock\n20', headers: { 'content-type': 'text/csv' } },
      false,
      0
    );
    BreweryParameters.switchToAdditionalParametersTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_number').should('have.value', 20);
    apiUtils.interceptPostDatasetTwingraphQuery(
      { body: 'wrong_column\n30', headers: { 'content-type': 'text/csv' } },
      false,
      0
    );
    BreweryParameters.getEventsTab().click({ force: true });
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').should('have.value', 0);
    ScenarioParameters.getDynamicValueErrorIcon().should('exist');
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').clear();
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').type('30');
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').should('have.value', 30);
    ScenarioParameters.save();
    ScenarioParameters.getDynamicValueErrorIcon().should('not.exist');
  });
});
