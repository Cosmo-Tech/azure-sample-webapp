// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Scenarios, ScenarioSelector, ScenarioParameters, Login } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SCENARIOS, SOLUTION } from '../../fixtures/stubbing/DatesAndTimezones';

// NOTE: this test should be launched from terminal with different timezones to check that timzeones have no impact on
// the dates displayed

describe('Scenario parameters of type date', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
    stub.setScenarios(SCENARIOS);
    stub.setSolutions([SOLUTION]);
  });

  after(() => {
    stub.stop();
  });

  it('should display correct dates from saved values in existing scenario', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(SCENARIOS[0].name, SCENARIOS[0].id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getStartDateInput().should('value', '01/20/2025');
    BreweryParameters.getEndDateInput().should('value', '07/25/2025');
    BreweryParameters.getEndDateHelperText().should('not.exist');

    BreweryParameters.getStartDateInput().clear();
    BreweryParameters.getStartDateInput().type('07/25/2025');
    BreweryParameters.getStartDateInput().should('value', '07/25/2025');
    BreweryParameters.getEndDateHelperText().should('be.visible').contains('start_date').contains('end_date');

    BreweryParameters.getEndDateInput().clear();
    BreweryParameters.getEndDateInput().type('07/26/2025');
    BreweryParameters.getEndDateInput().should('value', '07/26/2025');
    BreweryParameters.getEndDateHelperText().should('not.exist');

    const validateScenarioUpdateRequest = (req) => {
      const values = req.body.parametersValues;
      expect(values.find((el) => el.parameterId === 'start_date').value).to.equal('2025-07-25T00:00:00.000Z');
      expect(values.find((el) => el.parameterId === 'end_date').value).to.equal('2025-07-26T00:00:00.000Z');
    };
    const saveOptions = { updateOptions: { validateRequest: validateScenarioUpdateRequest } };
    ScenarioParameters.save(saveOptions);
  });

  it('should display correct dates from default values in unitialized scenario', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(SCENARIOS[1].name, SCENARIOS[1].id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getStartDateInput().should('value', '01/13/2025');
    BreweryParameters.getEndDateInput().should('value', '07/13/2025');
    BreweryParameters.getEndDateHelperText().should('not.exist');

    BreweryParameters.getStartDateInput().clear();
    BreweryParameters.getStartDateInput().type('07/13/2025');
    BreweryParameters.getStartDateInput().should('value', '07/13/2025');
    BreweryParameters.getEndDateHelperText().should('be.visible').contains('start_date').contains('end_date');

    BreweryParameters.getEndDateInput().clear();
    BreweryParameters.getEndDateInput().type('07/14/2025');
    BreweryParameters.getEndDateInput().should('value', '07/14/2025');
    BreweryParameters.getEndDateHelperText().should('not.exist');

    const validateScenarioUpdateRequest = (req) => {
      const values = req.body.parametersValues;
      expect(values.find((el) => el.parameterId === 'start_date').value).to.equal('2025-07-13T00:00:00.000Z');
      expect(values.find((el) => el.parameterId === 'end_date').value).to.equal('2025-07-14T00:00:00.000Z');
    };
    const saveOptions = { updateOptions: { validateRequest: validateScenarioUpdateRequest } };
    ScenarioParameters.save(saveOptions);
  });

  it('should display correct dates for min & max dates', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(SCENARIOS[2].name, SCENARIOS[2].id);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getStartDateInput().should('value', '01/13/2025');
    BreweryParameters.getEndDateInput().should('value', '07/13/2025');
    BreweryParameters.getStartDateHelperText().should('not.exist');
    BreweryParameters.getEndDateHelperText().should('not.exist');

    BreweryParameters.getStartDateInput().type('12/31/2024');
    BreweryParameters.getStartDateHelperText().should('be.visible').contains('Minimum date').contains('01/01/2025');
    // Adding a delay in type function to make test less brittle in Electron browser (passes without delay in Chrome)
    BreweryParameters.getStartDateInput().type('{leftArrow}{leftArrow}01/02/2026', { delay: 1 });
    BreweryParameters.getStartDateHelperText().should('be.visible').contains('Maximum date').contains('01/01/2026');
    BreweryParameters.getStartDateInput().type('{leftArrow}{leftArrow}01/13/2025', { delay: 1 });
    BreweryParameters.getStartDateHelperText().should('not.exist');

    BreweryParameters.getEndDateInput().type('06/30/2025');
    BreweryParameters.getEndDateHelperText().should('be.visible').contains('Minimum date').contains('07/01/2025');
    BreweryParameters.getEndDateInput().type('{leftArrow}{leftArrow}07/02/2026', { delay: 1 });
    BreweryParameters.getEndDateHelperText().should('be.visible').contains('Maximum date').contains('07/01/2026');
    BreweryParameters.getEndDateInput().type('07/13/2025');
    BreweryParameters.getEndDateHelperText().should('not.exist');
  });
});
