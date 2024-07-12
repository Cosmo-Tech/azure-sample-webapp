// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, Scenarios, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { SOLUTION_WITH_DYNAMIC_TABLE } from '../../fixtures/stubbing/TableParameters-dynamic_table/solution';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const EDITED_DATA_CSV = 'customers_from_dataset_edited.csv';
const twingraphQueryResponse = [
  {
    fields: {
      name: 'Customer3',
      thirsty: false,
      satisfaction: 0,
      surroundingSatisfaction: 0,
    },
  },
  {
    fields: {
      name: 'Customer1',
      thirsty: false,
      satisfaction: 0,
      surroundingSatisfaction: 0,
    },
  },
  {
    fields: {
      name: 'Customer2',
      thirsty: false,
      satisfaction: 0,
      surroundingSatisfaction: 0,
    },
  },
  {
    fields: {
      name: 'Customer4',
      thirsty: false,
      satisfaction: 0,
      surroundingSatisfaction: 0,
    },
  },
];

describe('can use dataset data in editable table', () => {
  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_TABLE]);
  });
  beforeEach(() => {
    Login.login();
  });
  after(() => {
    stub.stop();
  });
  it('can display a table filled with data fetched from dataset', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableLabel().should('be.visible').should('have.text', 'Customers');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', twingraphQueryResponse[0].fields.name);
  });
  it('can export data fetched from dataset and upload a new table', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.exportCustomersTableDataToCSV();
    BreweryParameters.importCustomersTableData(EDITED_DATA_CSV);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.getCustomersTableCell('name', 1).should('have.text', 'Client');
  });
  it('can fetch data from dataset, edit it without saving and revert', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getEventsRevertTableButton().should('not.exist');
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersRevertTableButton().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(twingraphQueryResponse);
    ScenarioParameters.getSaveButton().should('not.exist');
  });
  it('can fetch data from dataset and save table as dataset part, then revert data', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    ScenarioParameters.save({ datasetsEvents: [{ id: 'd-stbddtspr1', securityChanges: { default: 'admin' } }] });
    BreweryParameters.switchToEventsTab();
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[1].name, DEFAULT_SCENARIOS_LIST[1].id);
    ScenarioSelector.selectScenario(DEFAULT_SCENARIOS_LIST[0].name, DEFAULT_SCENARIOS_LIST[0].id);
    apiUtils.interceptDownloadWorkspaceFile();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(twingraphQueryResponse);
    ScenarioParameters.getSaveButton().should('exist');
  });
});
