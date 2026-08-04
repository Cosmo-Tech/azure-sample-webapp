// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Login, Scenarios, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { MAIN_DATASET } from '../../fixtures/stubbing/default';

const scenarioName = 'Test Cypress - Scenario without parameters - ' + utils.randomStr(7);
const runOptions = { runDuration: 0, finalStatus: 'Successful', expectedPollsCount: 1 };

describe('Run templates without parameters', () => {
  before(() => stub.start());
  beforeEach(() => Login.login());

  it('can be created and launched', () => {
    Scenarios.createScenario(scenarioName, true, MAIN_DATASET.name, RUN_TEMPLATE.WITHOUT_PARAMETERS);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getDatasetPartsTab().should('not.exist');
    BreweryParameters.getExtraDatasetPartTab().should('not.exist');
    BreweryParameters.getBasicTypesTab().should('not.exist');
    BreweryParameters.getCustomersTab().should('not.exist');
    BreweryParameters.getEventsTab().should('not.exist');
    BreweryParameters.getAdditionalParametersTab().should('not.exist');
    ScenarioParameters.getNoParametersPlaceholder().should('exist');
    ScenarioParameters.launch({ runOptions });
  });
});
