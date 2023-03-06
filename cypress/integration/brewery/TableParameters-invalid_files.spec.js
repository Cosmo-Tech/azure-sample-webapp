// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ScenarioSelector, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters, Login } from '../../commons/actions/brewery';
import { setup } from '../../commons/utils/setup';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const CSV_INVALID_FILE_PATH = 'customers_invalid.csv';
const XLSX_INVALID_FILE_PATH = 'customers_invalid.xlsx';

describe('Table parameters invalid files operations', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
    });
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('can import invalid files and display the errors panel', () => {
    const checkErrorsPanel = () => {
      const expectedErrors = [
        { summary: 'Missing fields', loc: 'Line 1' },
        { summary: 'Incorrect int value', loc: 'Line 2 , Column 1 ("age")' },
        { summary: 'Incorrect bool value' },
        { summary: 'Incorrect enum value' },
        { summary: 'Incorrect date value' },
        { summary: 'Incorrect number value' },
        { summary: 'Incorrect int value' },
        { summary: 'Incorrect bool value' },
        { summary: 'Incorrect enum value' },
        { summary: 'Incorrect date value' },
        { summary: 'Incorrect number value' },
      ];
      BreweryParameters.checkCustomersErrorsPanelFromList(expectedErrors);
    };
    ScenarioSelector.getScenarioSelectorInput().should('have.value', DEFAULT_SCENARIOS_LIST[0].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersImportButton().should('be.visible');
    BreweryParameters.getCustomersExportButton().should('be.visible');
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
    ScenarioParameters.edit();
    BreweryParameters.importCustomersTableData(CSV_INVALID_FILE_PATH);
    checkErrorsPanel();
    BreweryParameters.importCustomersTableData(XLSX_INVALID_FILE_PATH);
    checkErrorsPanel();
    ScenarioParameters.discard();
    BreweryParameters.getCustomersErrorsPanel().should('not.exist');
  });
});
