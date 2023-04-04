// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload';
import utils from '../../commons/TestUtils';

import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';

Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});

const SCENARIO_DATASET = DATASET.BREWERY_ADT;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

function forgeScenarioName() {
  const prefix = 'Scenario with additional parameters - ';
  return prefix + utils.randomStr(7);
}

describe('Additional advanced scenario parameters tests', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('additional advanced scenario parameters tests', () => {
    const INIT_VALUES = {
      additionalSeats: -4,
      evaluation: 'Good',
      volumeUnit: 'L',
      additionalTables: 3,
      comment: 'None',
      additionalDate: new Date('06/22/2022').toLocaleDateString(),
    };
    const VALUES_TO_UPDATE = {
      additionalSeats: 888,
      evaluation: 'Awful',
      volumeUnit: 'bl',
      additionalTables: 9090,
      comment: 'Strongly recommended',
      additionalDate: '06/07/2029',
    };

    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName);
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableCell('reservationsNumber', 0).should('have.text', '200');
    BreweryParameters.getAdditionalSeats().should('have.text', INIT_VALUES.additionalSeats);
    BreweryParameters.getActivated().should('have.text', 'OFF');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnit().should('have.text', INIT_VALUES.volumeUnit);
    BreweryParameters.getAdditionalTables().should('have.text', INIT_VALUES.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluation().should('have.text', INIT_VALUES.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getComment().should('have.text', INIT_VALUES.comment);
    BreweryParameters.getAdditionalDate().should('have.text', INIT_VALUES.additionalDate);

    ScenarioParameters.edit();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 0, '199').should('have.text', '199');
    // Additional seats values ranged from -600 to 2500
    // If the value is out of range, the last digit is not displayed
    BreweryParameters.getAdditionalSeatsInput().click().clear().type(-800).should('value', -80);
    BreweryParameters.getAdditionalSeatsInput().click().clear().type(200).should('value', 200);
    BreweryParameters.getAdditionalSeatsInput().click().clear().type(-1000).should('value', -100);
    BreweryParameters.getAdditionalSeatsInput().click().clear().type(3000).should('value', 300);
    BreweryParameters.getAdditionalSeatsInput().click().clear().type(2000).should('value', 2000);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButton('m³').click();
    BreweryParameters.switchToEventsTab();
    BreweryParameters.getActivatedInput().check().should('be.checked');

    BreweryParameters.switchToAdditionalParametersTab();
    // Additional tables values ranged from -150 to 12000
    // If the value is out of range, the last digit is not displayed
    BreweryParameters.getAdditionalTablesInput().click().clear().type(-250).should('value', -25);
    BreweryParameters.getAdditionalTablesInput().click().clear().type(-120).should('value', -120);
    BreweryParameters.getAdditionalTablesInput().click().clear().type(50000).should('value', 5000);
    BreweryParameters.getAdditionalTablesInput().click().clear().type(6000).should('value', 6000);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().click().clear().type('Wonderful');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().click().clear().type('Incredible service');
    BreweryParameters.getAdditionalDateInput()
      .click()
      .type('{moveToStart}' + '29/08/1997')
      .should('value', '29/08/1997');

    ScenarioParameters.discard();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsTableCell('reservationsNumber', 0).should('have.text', '200');
    BreweryParameters.getAdditionalSeats().should('have.text', INIT_VALUES.additionalSeats);
    BreweryParameters.getActivated().should('have.text', 'OFF');

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnit().should('have.text', INIT_VALUES.volumeUnit);
    BreweryParameters.getAdditionalTables().should('have.text', INIT_VALUES.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluation().should('have.text', INIT_VALUES.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getComment().should('have.text', INIT_VALUES.comment);
    BreweryParameters.getAdditionalDate().should('have.text', INIT_VALUES.additionalDate);

    ScenarioParameters.edit();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.editEventsTableStringCell('reservationsNumber', 0, '199').should('have.text', '199');
    BreweryParameters.getAdditionalSeatsInput()
      .click()
      .clear()
      .type(VALUES_TO_UPDATE.additionalSeats)
      .should('value', VALUES_TO_UPDATE.additionalSeats);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getVolumeUnitRadioButton(VALUES_TO_UPDATE.volumeUnit).click();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getActivatedInput().uncheck();

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getAdditionalTablesInput().click().clear().type(VALUES_TO_UPDATE.additionalTables);

    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEvaluationInput().click().clear().type(VALUES_TO_UPDATE.evaluation);

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().click().clear().type(VALUES_TO_UPDATE.comment);
    BreweryParameters.getAdditionalDateInput()
      .click()
      .type('{moveToStart}' + VALUES_TO_UPDATE.additionalDate);

    ScenarioParameters.updateAndLaunch();

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
  });
});
