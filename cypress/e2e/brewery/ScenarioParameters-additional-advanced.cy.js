// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Scenarios, ScenarioSelector, ScenarioManager, ScenarioParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const clone = rfdc();

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const EVENTS_CSV_FILE = 'events.csv';

const SCENARIO1 = clone(BASIC_PARAMETERS_SIMULATION_RUNNER);
const SCENARIO2 = clone(BASIC_PARAMETERS_SIMULATION_RUNNER);
SCENARIO1.id = 'r-stubbedScenario1';
SCENARIO2.id = 'r-stubbedScenario2';
SCENARIO1.name = 'Cypress - Additional parameters - Scenario 1';
SCENARIO2.name = 'Cypress - Additional parameters - Scenario 2';

const RADIO_BUTTON_KEYS = {
  LITRE: 'LITRE',
  BARREL: 'BARREL',
  CUBIC_METRE: 'CUBIC_METRE',
};
const INIT_VALUES = {
  additionalSeats: -4,
  evaluation: 'Good',
  volumeUnit: 'L',
  additionalTables: 3,
  comment: 'None',
  additionalDate: '06/22/2022',
  countries: [],
  scenarioToCompare: '',
};
const VALUES_TO_UPDATE = {
  additionalSeats: 888,
  evaluation: 'Awful',
  volumeUnit: 'bl',
  additionalTables: 9090,
  comment: 'Strongly recommended',
  additionalDate: '07/12/2022',
  countries: ['France', 'Germany', 'Italy'],
  scenarioToCompare: SCENARIO1.name,
};

const runOptions = {
  runDuration: 1000,
  finalStatus: 'Successful',
  expectedPollsCount: 2,
};

describe('Additional advanced scenario parameters tests', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
    stub.setRunners([SCENARIO1, SCENARIO2]);
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('additional advanced scenario parameters tests', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(SCENARIO2.name, SCENARIO2.id);
    ScenarioParameters.expandParametersAccordion();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.importEventsTableData(EVENTS_CSV_FILE);
    BreweryParameters.getEventsTableCell('reservationsNumber', 0).should('have.text', '200');
    BreweryParameters.getAdditionalSeatsInput().should('value', INIT_VALUES.additionalSeats);
    BreweryParameters.getActivatedInput().should('not.be.checked');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButtonInput(RADIO_BUTTON_KEYS.LITRE).should('be.checked');
    BreweryParameters.getAdditionalTablesInput().should('value', INIT_VALUES.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().should('value', INIT_VALUES.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().should('value', INIT_VALUES.comment);
    BreweryParameters.getAdditionalDateInput().contains(INIT_VALUES.additionalDate);
    BreweryParameters.getScenarioToCompareSelectInput().should('have.text', '');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 0, '199').should('have.text', '199');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButtonInput(RADIO_BUTTON_KEYS.CUBIC_METRE).click();
    BreweryParameters.switchToEventsTab();
    BreweryParameters.getActivatedInput().check().should('be.checked');

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().click().clear().type('Wonderful');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().click().clear().type('Incredible service');
    BreweryParameters.getAdditionalDateInput().type('08/29/1997');
    BreweryParameters.getAdditionalDateInput().contains('08/29/1997');

    BreweryParameters.selectScenarioToCompareOption(SCENARIO1.id);
    BreweryParameters.getScenarioToCompareSelectInput().should('value', VALUES_TO_UPDATE.scenarioToCompare);

    ScenarioParameters.discard();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.importEventsTableData(EVENTS_CSV_FILE);
    BreweryParameters.getEventsTableCell('reservationsNumber', 0).should('have.text', '200');
    BreweryParameters.getAdditionalSeatsInput().should('value', INIT_VALUES.additionalSeats);
    BreweryParameters.getActivatedInput().should('not.be.checked');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButtonInput(RADIO_BUTTON_KEYS.LITRE).should('be.checked');
    BreweryParameters.getAdditionalTablesInput().should('value', INIT_VALUES.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().should('value', INIT_VALUES.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().should('value', INIT_VALUES.comment);
    BreweryParameters.getAdditionalDateInput().contains(INIT_VALUES.additionalDate);
    BreweryParameters.getScenarioToCompareSelectInput().should('value', INIT_VALUES.scenarioToCompare);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 0, '199').should('have.text', '199');
    BreweryParameters.getAdditionalSeatsInput()
      .click()
      .clear()
      .type(VALUES_TO_UPDATE.additionalSeats)
      .should('value', VALUES_TO_UPDATE.additionalSeats);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButton(RADIO_BUTTON_KEYS.BARREL).click();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getActivatedInput().uncheck();

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getAdditionalTablesInput().click().clear().type(VALUES_TO_UPDATE.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().click().clear().type(VALUES_TO_UPDATE.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().click().clear().type(VALUES_TO_UPDATE.comment);
    BreweryParameters.getAdditionalDateInput().type(VALUES_TO_UPDATE.additionalDate);
    BreweryParameters.selectScenarioToCompareOption(SCENARIO1.id);
    BreweryParameters.getScenarioToCompareSelectInput().should('value', VALUES_TO_UPDATE.scenarioToCompare);

    ScenarioParameters.launch({ scenarioId: SCENARIO2.id, runOptions, saveAndLaunch: true });

    // Test input in read only mode
    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableCell('reservationsNumber', 0).should('have.text', '199');
    BreweryParameters.getAdditionalSeats().should('have.text', VALUES_TO_UPDATE.additionalSeats);
    BreweryParameters.getActivated().should('have.text', 'OFF');
    BreweryParameters.getEvaluation().should('have.text', VALUES_TO_UPDATE.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getAdditionalTables().should('have.text', VALUES_TO_UPDATE.additionalTables);
    BreweryParameters.getVolumeUnit().should('have.text', VALUES_TO_UPDATE.volumeUnit);
    BreweryParameters.getComment().should('have.text', VALUES_TO_UPDATE.comment);
    BreweryParameters.getAdditionalDate().should(
      'have.text',
      new Date(VALUES_TO_UPDATE.additionalDate).toLocaleDateString()
    );
    BreweryParameters.getScenarioToCompare().should('have.text', VALUES_TO_UPDATE.scenarioToCompare);
  });
});
