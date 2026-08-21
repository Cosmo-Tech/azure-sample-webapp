// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, ScenarioSelector, TableParameters } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  SOLUTION,
  REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_SCENARIO,
  NOT_IMPACTED_BY_REQUIRED_SCENARIO,
  SCENARIO_REQUIRED_TRUE_SCENARIO,
  LIST_REQUIRED_TRUE_SCENARIO,
  NUMBER_REQUIRED_TRUE_SCENARIO,
  INT_REQUIRED_TRUE_SCENARIO,
  STRING_REQUIRED_TRUE_SCENARIO,
  STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_SCENARIO,
  FILE_REQUIRED_TRUE_SCENARIO,
  TABLE_REQUIRED_TRUE_SCENARIO,
  REQUIRED_DISABLED_IN_CONFIG_SCENARIO,
  REQUIRED_BY_DEFAULT_SCENARIO,
  NOT_REQUIRED_BY_DEFAULT_SCENARIO,
} from '../../fixtures/stubbing/ScenarioParameters_RequiredParameters';

const runOptions = { runDuration: 0, finalStatus: 'Successful', expectedPollsCount: 0 };

describe('ScenarioParameters - Required Option - requiredEnabledWithInconsistentConfig', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_SCENARIO]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should have empty input fields and enabled launch button', () => {
    ScenarioSelector.selectScenario(
      REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_SCENARIO.name,
      REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_SCENARIO.id
    );
    ScenarioParameters.expandParametersAccordion();

    // Text placeholders must be shown because there are no options to choose. The red asterisk indicator must not be
    // shown because the webapp disables the "required" constraint in case of misconfiguration
    ScenarioParameters.getParameterContainer('enum-input-select-enumRequiredTrue_noEnumValues').contains(
      'enumRequiredTrue_noEnumValues'
    );
    ScenarioParameters.getParameterContainer('enum-input-select-enumRequiredTrue_noEnumValues')
      .contains('enumRequiredTrue_noEnumValues*')
      .should('not.exist');
    ScenarioParameters.getParameterContainer('multi-input-listRequiredTrue_noEnumValues').contains(
      'listRequiredTrue_noEnumValues'
    );
    ScenarioParameters.getParameterContainer('multi-input-listRequiredTrue_noEnumValues')
      .contains('listRequiredTrue_noEnumValues*')
      .should('not.exist');

    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    const validateRequest = (req) => {
      const expectedValues = [
        { parameterId: 'enumRequiredTrue_noEnumValues', varType: 'enum', value: '' },
        { parameterId: 'listRequiredTrue_noEnumValues', varType: 'list', value: '[]' },
      ];
      expect(req.body.parametersValues).to.deep.equal(expectedValues);
    };
    ScenarioParameters.launch({ runOptions, saveAndLaunch: true, runnerUpdateOptions: { validateRequest } });
  });
});

describe('ScenarioParameters - Required Option - notImpactedByRequired', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([NOT_IMPACTED_BY_REQUIRED_SCENARIO]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should have launch button enabled when all required parameters have options', () => {
    ScenarioSelector.selectScenario(NOT_IMPACTED_BY_REQUIRED_SCENARIO.name, NOT_IMPACTED_BY_REQUIRED_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');
  });
});

describe('ScenarioParameters - Required Option - requiredDisabledInConfig', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([REQUIRED_DISABLED_IN_CONFIG_SCENARIO]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should keep launch button enabled even when clearing optional parameters', () => {
    ScenarioSelector.selectScenario(REQUIRED_DISABLED_IN_CONFIG_SCENARIO.name, REQUIRED_DISABLED_IN_CONFIG_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.clearDateParameterInput(
      ScenarioParameters.getDateParameterInput('date-input-dateRequiredFalse')
    );
    ScenarioParameters.getLaunchButton().should('not.be.disabled');

    ScenarioParameters.getParameterInput('text-input-stringRequiredFalse').click().clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');

    ScenarioParameters.getParameterInput('text-input-stringRequiredFalseMinLength1').click().clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');

    ScenarioParameters.getParameterInput('number-input-numberRequiredFalse').click().clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');

    ScenarioParameters.getParameterInput('number-input-intRequiredFalse').click().clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    const validateRequest = (req) => {
      const expectedValues = [
        { parameterId: 'scenarioRequiredFalse', varType: 'enum', value: '' },
        { parameterId: 'dateRequiredFalse', varType: 'date', value: '' },
        { parameterId: 'stringRequiredFalse', varType: 'string', value: '' },
        { parameterId: 'stringRequiredFalseMinLength1', varType: 'string', value: '' },
        { parameterId: 'enumRequiredFalse_noEnumValues', varType: 'enum', value: '' },
        { parameterId: 'listRequiredFalse_noEnumValues', varType: 'list', value: '[]' },
        { parameterId: 'listRequiredFalse', varType: 'list', value: '[]' },
        { parameterId: 'numberRequiredFalse', varType: 'number', value: '' },
        { parameterId: 'intRequiredFalse', varType: 'int', value: '' },
      ];
      expect(req.body.parametersValues).to.deep.equal(expectedValues);
    };
    ScenarioParameters.save({ updateOptions: { validateRequest } });
  });
});

describe('ScenarioParameters - Required Option - requiredEnabledInConfig', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([
      SCENARIO_REQUIRED_TRUE_SCENARIO,
      LIST_REQUIRED_TRUE_SCENARIO,
      NUMBER_REQUIRED_TRUE_SCENARIO,
      INT_REQUIRED_TRUE_SCENARIO,
      STRING_REQUIRED_TRUE_SCENARIO,
      STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_SCENARIO,
      FILE_REQUIRED_TRUE_SCENARIO,
      TABLE_REQUIRED_TRUE_SCENARIO,
    ]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should handle required parameter validation for all parameter types', () => {
    // Test Scenario Type (non-empty default - launch initially enabled)
    ScenarioSelector.selectScenario(SCENARIO_REQUIRED_TRUE_SCENARIO.name, SCENARIO_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('single-select-text-scenarioRequiredTrue').click();
    cy.get(`[data-cy=single-select-option-${SCENARIO_REQUIRED_TRUE_SCENARIO.id}]`).click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    ScenarioParameters.getParameterInput('single-select-text-scenarioRequiredTrue').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    // Test List Type (non-empty default - launch initially enabled)
    ScenarioSelector.selectScenario(LIST_REQUIRED_TRUE_SCENARIO.name, LIST_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('multi-input-listRequiredTrue').click();
    cy.get('[id="listRequiredTrue-option-1"]').click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    cy.get('[id="listRequiredTrue-option-1"]').click();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    // Test Number Type (non-empty default - launch initially enabled)
    ScenarioSelector.selectScenario(NUMBER_REQUIRED_TRUE_SCENARIO.name, NUMBER_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('number-input-numberRequiredTrue').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');

    ScenarioParameters.getParameterInput('number-input-numberRequiredTrue').type('1');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.discard();

    // Test Int Type (non-empty default - launch initially enabled)
    ScenarioSelector.selectScenario(INT_REQUIRED_TRUE_SCENARIO.name, INT_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('number-input-intRequiredTrue').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');

    ScenarioParameters.getParameterInput('number-input-intRequiredTrue').type('123');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.discard();

    // Test String Type (empty default - launch initially disabled)
    ScenarioSelector.selectScenario(STRING_REQUIRED_TRUE_SCENARIO.name, STRING_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('text-input-stringRequiredTrue').click().clear().type('test value');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    ScenarioParameters.getParameterInput('text-input-stringRequiredTrue').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    // Test String Type with minLength (empty default - launch initially disabled)
    ScenarioSelector.selectScenario(
      STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_SCENARIO.name,
      STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_SCENARIO.id
    );
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('text-input-stringRequiredUndefinedMinLength1').click().clear().type('x');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    ScenarioParameters.getParameterInput('text-input-stringRequiredUndefinedMinLength1').click({ force: true }).clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    // Test File Type (empty default - launch initially disabled)
    ScenarioSelector.selectScenario(FILE_REQUIRED_TRUE_SCENARIO.name, FILE_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterContainer('file-upload-fileRequiredTrue')
      .find('input[type="file"]')
      .selectFile('cypress/fixtures/dummy_dataset_1.csv', { force: true });
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    ScenarioParameters.getParameterContainer('file-upload-fileRequiredTrue').find('[data-cy=delete-button]').click();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    // Test Table Type (empty default - launch initially disabled)
    ScenarioSelector.selectScenario(TABLE_REQUIRED_TRUE_SCENARIO.name, TABLE_REQUIRED_TRUE_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();

    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterContainer('table-tableRequiredTrue').find('[data-cy=add-row-button]').click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');

    TableParameters.getRow(ScenarioParameters.getParameterContainer('table-tableRequiredTrue'), 0).click();
    ScenarioParameters.getParameterContainer('table-tableRequiredTrue').find('[data-cy=delete-rows-button]').click();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    // Known issue: the table status is still considered as "dirty" after removing the last row, the "save" button is
    // thus still visible
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');
    ScenarioParameters.discard();
  });
});

describe('ScenarioParameters - Required Option - requiredByDefault', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([REQUIRED_BY_DEFAULT_SCENARIO]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should have non-empty default values and disable launch when field is cleared', () => {
    ScenarioSelector.selectScenario(REQUIRED_BY_DEFAULT_SCENARIO.name, REQUIRED_BY_DEFAULT_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.clearDateParameterInput(
      ScenarioParameters.getDateParameterInput('date-input-dateRequiredUndefined')
    );
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');
    ScenarioParameters.discard();

    ScenarioParameters.getParameterInput('number-input-numberRequiredUndefined').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');
    ScenarioParameters.getParameterInput('number-input-numberRequiredUndefined').type('1');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.discard();

    ScenarioParameters.getParameterInput('number-input-intRequiredUndefined').click().clear();
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('be.disabled');
    ScenarioParameters.getParameterInput('number-input-intRequiredUndefined').type('1');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.discard();
  });
});

describe('ScenarioParameters - Required Option - notRequiredByDefault', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION]);
    stub.setRunners([NOT_REQUIRED_BY_DEFAULT_SCENARIO]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should have launch button enabled even when clearing optional parameters without defaults', () => {
    ScenarioSelector.selectScenario(NOT_REQUIRED_BY_DEFAULT_SCENARIO.name, NOT_REQUIRED_BY_DEFAULT_SCENARIO.id);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('single-select-text-scenarioRequiredUndefined').click({ force: true });
    cy.get(`[data-cy=single-select-option-${NOT_REQUIRED_BY_DEFAULT_SCENARIO.id}]`).click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.getParameterInput('single-select-text-scenarioRequiredUndefined').click({ force: true }).clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('multi-input-listRequiredUndefined').click({ force: true });
    cy.get('[id="listRequiredUndefined-option-0"]').click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    cy.get('[id="listRequiredUndefined-option-0"]').click();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    ScenarioParameters.getParameterInput('text-input-stringRequiredUndefined')
      .click({ force: true })
      .clear()
      .type('test');
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.getParameterInput('text-input-stringRequiredUndefined').click({ force: true }).clear();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioParameters.getSaveButton().should('not.exist');

    const validateRequest = (req) => {
      const expectedValues = [
        { parameterId: 'enumRequiredUndefined_noEnumValues', varType: 'enum', value: '' },
        { parameterId: 'listRequiredUndefined_noEnumValues', varType: 'list', value: '[]' },
        { parameterId: 'scenarioRequiredUndefined', varType: 'enum', value: '' },
        { parameterId: 'stringRequiredUndefined', varType: 'string', value: '' },
        { parameterId: 'listRequiredUndefined', varType: 'list', value: '[]' },
      ];
      expect(req.body.parametersValues).to.deep.equal(expectedValues);
    };
    ScenarioParameters.launch({ runOptions, saveAndLaunch: true, runnerUpdateOptions: { validateRequest } });
  });
});
