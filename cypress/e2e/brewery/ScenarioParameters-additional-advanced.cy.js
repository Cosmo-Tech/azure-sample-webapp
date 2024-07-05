// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

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
  beforeEach(() => {
    Login.login();
  });

  const scenarioNamesToDelete = [];
  after(() => {
    ScenarioManager.deleteScenarioList(scenarioNamesToDelete);
  });

  it('additional advanced scenario parameters tests', () => {
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
      additionalDate: '12/07/2022',
      countries: ['France', 'Germany', 'Italy'],
      scenarioToCompare: forgeScenarioName(),
    };

    const scenarioName = forgeScenarioName();
    scenarioNamesToDelete.push(scenarioName, VALUES_TO_UPDATE.scenarioToCompare);
    Scenarios.createScenario(VALUES_TO_UPDATE.scenarioToCompare, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE).then(
      (value) => {
        cy.wrap(value.scenarioCreatedId).as('scenarioToCompareId');
      }
    );
    Scenarios.createScenario(scenarioName, true, SCENARIO_DATASET, SCENARIO_RUN_TEMPLATE);

    BreweryParameters.switchToEventsTab();
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
    BreweryParameters.getAdditionalDateInput().should('value', INIT_VALUES.additionalDate);
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
    BreweryParameters.getAdditionalDateInput()
      .click()
      .type('{moveToStart}' + '29/08/1997')
      .should('value', '29/08/1997');

    cy.get('@scenarioToCompareId').then((id) => BreweryParameters.selectScenarioToCompareOption(id));
    BreweryParameters.getScenarioToCompareSelectInput().should('value', VALUES_TO_UPDATE.scenarioToCompare);

    ScenarioParameters.discard();

    BreweryParameters.switchToEventsTab();
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
    BreweryParameters.getAdditionalDateInput().should('value', INIT_VALUES.additionalDate);
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
    BreweryParameters.getAdditionalDateInput()
      .click()
      .type('{moveToStart}' + VALUES_TO_UPDATE.additionalDate);
    cy.get('@scenarioToCompareId').then((id) => {
      BreweryParameters.selectScenarioToCompareOption(id);
    });
    BreweryParameters.getScenarioToCompareSelectInput().should('value', VALUES_TO_UPDATE.scenarioToCompare);

    ScenarioParameters.launch();

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
