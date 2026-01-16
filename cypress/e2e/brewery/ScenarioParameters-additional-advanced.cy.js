// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Scenarios, ScenarioManager, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';

const SCENARIO_DATASET = DATASET.BREWERY_STORAGE;
const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;
Cypress.Keyboard.defaults({
  keystrokeDelay: 0,
});
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
      additionalDate: '07/12/2022',
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

    // Wait for scenario view to be fully loaded
    Scenarios.getScenarioViewTab(60).should('be.visible');

    BreweryParameters.switchToEventsTab();
    // Import events data since the dataset may not have it
    BreweryParameters.importEventsTableData('events.csv');
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

    BreweryParameters.switchToAdditionalParametersTab();
    BreweryParameters.getCommentInput().click().clear().type('Incredible service');
    // Select a different date (08/29/2021) using the calendar picker
    cy.get('[data-cy=date-input-additional_date]').find('button[aria-label*="Choose date"]').click();
    // Navigate back to August 2021 using arrow buttons (from June 2022)
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // May 2022
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Apr 2022
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Mar 2022
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Feb 2022
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Jan 2022
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Dec 2021
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Nov 2021
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Oct 2021
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Sep 2021
    cy.get('.MuiPickersArrowSwitcher-root button').first().click(); // Aug 2021
    cy.get('.MuiDayCalendar-root button').contains('29').click();
    BreweryParameters.getAdditionalDateInput().should('value', '08/29/2021');

    cy.get('@scenarioToCompareId').then((id) => BreweryParameters.selectScenarioToCompareOption(id));
    BreweryParameters.getScenarioToCompareSelectInput().should('value', VALUES_TO_UPDATE.scenarioToCompare);

    ScenarioParameters.discard();

    BreweryParameters.switchToEventsTab();
    BreweryParameters.importEventsTableData('events.csv');
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
    BreweryParameters.getCommentInput().click().clear().type(VALUES_TO_UPDATE.comment);
    // Click the calendar button to open the date picker
    cy.get('[data-cy=date-input-additional_date]').find('button[aria-label*="Choose date"]').click();
    // Navigate to July 2022 (one month forward from June 2022) and select day 12
    cy.get('.MuiPickersArrowSwitcher-root button').last().click(); // July 2022
    cy.get('.MuiDayCalendar-root button').contains('12').click();
    // Verify the date was set correctly
    BreweryParameters.getAdditionalDateInput().should('value', VALUES_TO_UPDATE.additionalDate);
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
    BreweryParameters.getEvaluation().should('have.text', INIT_VALUES.evaluation);

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
