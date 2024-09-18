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
    Login.login();
  });
  after(stub.stop);

  it('can display parameters with dynamic values', () => {
    const queryResponseBasicTypes = [{ stock: 10 }];
    const queryResponseAdditionalParameters = [{ restock: 20 }];
    const queryResponseEvents = [{ waiters: 30 }];

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponseBasicTypes, false);
    BreweryParameters.switchToBasicTypesTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_int').should('have.value', 10);
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponseAdditionalParameters, false);
    BreweryParameters.switchToAdditionalParametersTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_number').should('have.value', 20);
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponseEvents, false);
    BreweryParameters.switchToEventsTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').should('have.value', 0);
    ScenarioParameters.getDynamicValueErrorIcon().should('exist');
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').clear();
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').type('30');
    ScenarioParameters.getParameterInput('number-input-dynamic_number_error').should('have.value', 30);
    ScenarioParameters.save();
    ScenarioParameters.getDynamicValueErrorIcon().should('not.exist');
  });
});
