// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, ScenarioParameters, Scenarios, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { DATASETS } from '../../fixtures/stubbing/ScenarioParameters/datasets';
import { SOLUTION_WITH_DYNAMIC_TABLE } from '../../fixtures/stubbing/TableParameters-dynamic_table/solution';
import { DEFAULT_SIMULATION_RUNNERS } from '../../fixtures/stubbing/default';

const clone = rfdc();

const EDITED_DATA_CSV = 'customers_from_dataset_edited.csv';
const queryResponse =
  'name,thirsty,satisfaction,surroundingSatisfaction\n' +
  'Customer3,false,0,0\n' +
  'Customer1,false,0,0\n' +
  'Customer2,false,0,0\n' +
  'Customer4,false,0,0';
const firstCustomerName = 'Customer3';

const runOptions = {
  runDuration: 1000,
  finalStatus: 'Successful',
  expectedPollsCount: 2,
};

const selectScenarioAndWaitForScenarioViewUrlUpdate = (scenario) => {
  ScenarioSelector.selectScenario(scenario.name, scenario.id);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // Work-around for electron browser
  cy.url({ timeout: 3000 }).should('include', `/scenario/${scenario.id}`);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100); // Work-around for electron browser
};

describe('can use dataset data in editable table', () => {
  const SCENARIOS = clone(DEFAULT_SIMULATION_RUNNERS);
  SCENARIOS.forEach((scenario) => (scenario.runTemplateId = 'sim_mock_parameters'));

  before(() => {
    stub.start();
    stub.setDatasets(DATASETS);
    stub.setRunners(SCENARIOS);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_TABLE]);
  });
  beforeEach(() => {
    Login.login();
  });
  after(() => {
    stub.stop();
  });
  it('can display a table filled with data fetched from dataset', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableLabel().should('be.visible').should('have.text', 'Customers');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', firstCustomerName);
  });
  it('can export data fetched from dataset and upload a new table', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.exportCustomersTableDataToCSV();
    BreweryParameters.importCustomersTableData(EDITED_DATA_CSV);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.getCustomersTableCell('name', 1).should('have.text', 'Client');
    ScenarioParameters.discard();
  });
  it('can fetch data from dataset, edit it without saving and revert', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsRevertTableButton().should('not.exist');
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersRevertTableButton().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(queryResponse);
    ScenarioParameters.getSaveButton().should('not.exist');
  });
  it('can fetch data from dataset, edit it, save and revert without reloading', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersRevertTableButton().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    ScenarioParameters.save({ datasetPartEvents: [{ id: 'dp-newCustomersDatasetPart' }] });
    BreweryParameters.revertCustomersTable(queryResponse);
    ScenarioParameters.getSaveButton().should('exist');
    ScenarioParameters.discard();
  });
  it('can fetch data from dataset and save table as dataset part, then revert data after reloading scenario', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[1]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[1].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    ScenarioParameters.save({ datasetPartEvents: [{ id: 'dp-newCustomersDatasetPart' }] });
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[2].name);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[1]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[1].name);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(queryResponse);
    ScenarioParameters.getSaveButton().should('exist');
    ScenarioParameters.save({
      datasetPartEvents: [
        { id: 'dp-newCustomersDatasetPartAfterEdition' },
        { id: 'dp-newCustomersDatasetPart', delete: true },
      ],
    });
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[2].name);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[1]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[1].name);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
  it('can fetch data from dataset and save table on first save', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getAdditionalSeatsInput().click().clear().type('10');
    ScenarioParameters.save({ datasetPartEvents: [{ id: 'dp-newCustomersDatasetPart' }] });
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
  it('can fetch data from dataset and save table on first launch', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.switchToEventsTab();
    ScenarioParameters.launch({
      saveAndLaunch: true,
      datasetPartEvents: [{ id: 'd-stbddtspr5' }],
      runOptions,
    });
    ScenarioParameters.waitForScenarioRunEnd();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[4]);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
});

describe('save table on second launch', () => {
  const SCENARIOS = clone(DEFAULT_SIMULATION_RUNNERS);
  SCENARIOS.forEach((scenario) => (scenario.runTemplateId = 'sim_mock_parameters'));

  before(() => {
    stub.start();
    stub.setDatasets(DATASETS);
    stub.setRunners(SCENARIOS);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_TABLE]);
  });
  beforeEach(() => {
    Login.login();
  });
  after(() => {
    stub.stop();
  });
  it('can fetch data from dataset and save table on second launch', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[4]);
    ScenarioParameters.launch({
      saveAndLaunch: true,
      runOptions,
    });
    ScenarioParameters.waitForScenarioRunEnd();
    ScenarioParameters.expandParametersAccordion();
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    ScenarioParameters.launch({
      saveAndLaunch: true,
      datasetPartEvents: [{ id: 'd-stbddtspr6' }],
      runOptions,
    });
    ScenarioParameters.waitForScenarioRunEnd();
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[0]);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[4]);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
});
