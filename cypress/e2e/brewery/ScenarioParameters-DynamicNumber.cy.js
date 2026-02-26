// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, Scenarios } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  DATASETS,
  SCENARIOS_WITH_DYNAMIC_NUMBERS,
  SOLUTION_WITH_DYNAMIC_PARAMETERS,
} from '../../fixtures/stubbing/ScenarioParameters';

const queryResponseBasicTypes = 'stock\n10';
const queryResponseAdditionalParameters = 'restock\n20';
const queryResponseEvents = 'wrong_column\n30';

// TODO: refactor interceptPostDatasetTwingraphQuery to simplify input parameter
const interceptDatasetQuery = (responseBody) => apiUtils.interceptPostDatasetTwingraphQuery({ body: responseBody });

describe('dynamic value for number input', () => {
  before(() => {
    stub.start();
    stub.setDatasets(DATASETS);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_PARAMETERS]);
    stub.setRunners(SCENARIOS_WITH_DYNAMIC_NUMBERS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(stub.stop);

  it('can display parameters with dynamic values', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();

    interceptDatasetQuery(queryResponseBasicTypes);
    BreweryParameters.switchToBasicTypesTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_int').should('have.value', 10);

    interceptDatasetQuery(queryResponseAdditionalParameters);
    BreweryParameters.switchToAdditionalParametersTab();
    ScenarioParameters.getParameterInput('number-input-dynamic_number').should('have.value', 20);

    interceptDatasetQuery(queryResponseEvents);
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
