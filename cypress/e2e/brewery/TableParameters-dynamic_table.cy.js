// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, ScenarioParameters, Scenarios, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { DATASETS_TWINGRAPH } from '../../fixtures/stubbing/DatasetManager';
import { SOLUTION_WITH_DYNAMIC_TABLE } from '../../fixtures/stubbing/TableParameters-dynamic_table/solution';
import { DEFAULT_SCENARIOS_LIST } from '../../fixtures/stubbing/default';

const clone = rfdc();

const EDITED_DATA_CSV = 'customers_from_dataset_edited.csv';
const twingraphQueryResponse = `name,satisfaction,surroundingSatisfaction,thirsty
Customer3,0,0,false
Customer1,0,0,false
Customer2,0,0,false
Customer4,0,0,false`;

const runOptions = {
  runDuration: 1000,
  dataIngestionDuration: 1000,
  finalStatus: 'Successful',
  expectedPollsCount: 2,
};

const selectScenarioAndWaitForScenarioViewUrlUpdate = (scenario) => {
  // Wait for any loading/backdrop to finish
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(300); // Wait for UI to settle
  ScenarioSelector.selectScenario(scenario.name, scenario.id);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(300); // Work-around for electron browser
  cy.url({ timeout: 10000 }).should('include', `/scenario/${scenario.id}`);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(300); // Work-around for electron browser
};

describe('can use dataset data in editable table', () => {
  const SCENARIOS = clone(DEFAULT_SCENARIOS_LIST);
  SCENARIOS.forEach((scenario) => {
    scenario.datasetList = ['D-stbdataset11'];
    scenario.datasets = { ...scenario.datasets, bases: ['D-stbdataset11'], parameter: 'D-stbdataset11' };
  });

  before(() => {
    stub.start();
    stub.setDatasets(DATASETS_TWINGRAPH);
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
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableLabel().should('be.visible').should('have.text', 'Customers');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
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
    ScenarioParameters.discard();
  });
  it('can fetch data from dataset, edit it without saving and revert', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToEventsTab();
    BreweryParameters.getEventsRevertTableButton().should('not.exist');
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersRevertTableButton().should('exist');
    // Wait for cell to have data before attempting to edit
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(twingraphQueryResponse);
    ScenarioParameters.getSaveButton().should('not.exist');
  });
  it('can fetch data from dataset, edit it, save and revert without reloading', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersRevertTableButton().should('exist');
    BreweryParameters.editCustomersTableStringCell('name', 0, 'Client').should('have.text', 'Client');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.save();
    BreweryParameters.revertCustomersTable(twingraphQueryResponse);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
    ScenarioParameters.getSaveButton().should('not.exist');
  });
  it.skip('can fetch data from dataset and save table as dataset part, then revert data after reloading scenario', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[1]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[1].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
    BreweryParameters.importCustomersTableData(EDITED_DATA_CSV);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.save({ datasetPartsEvents: [{ id: 'dp-stbddtspr2' }] });
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[2].name);
    apiUtils.interceptDownloadDatasetPart();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[1]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[1].name);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.revertCustomersTable(twingraphQueryResponse);
    ScenarioParameters.getSaveButton().should('exist');
    ScenarioParameters.save({ datasetPartsEvents: [{ id: 'dp-stbddtspr3' }] });
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
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[2].name);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
    BreweryParameters.importCustomersTableData(EDITED_DATA_CSV);
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getAdditionalSeatsInput().click().clear().type('10');
    ScenarioParameters.getSaveButton().should('exist').should('not.be.disabled');
    ScenarioParameters.save({ datasetPartsEvents: [{ id: 'dp-stbddtspr4' }] });
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[3].name);
    apiUtils.interceptDownloadDatasetPart();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[2]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[2].name);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Client');
  });
  it('can fetch data from dataset and save table on first launch', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse, false);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.switchToEventsTab();
    ScenarioParameters.launch({
      saveAndLaunch: true,
      runOptions,
    });
    ScenarioParameters.waitForScenarioRunEnd();
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[4]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[4].name);
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse);
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[3]);
    ScenarioSelector.getScenarioSelectorInput().should('have.value', SCENARIOS[3].name);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
});

describe('save table on second launch', () => {
  const SCENARIOS = clone(DEFAULT_SCENARIOS_LIST);
  SCENARIOS.forEach((scenario) => {
    scenario.datasetList = ['D-stbdataset11'];
    scenario.datasets = { ...scenario.datasets, bases: ['D-stbdataset11'], parameter: 'D-stbdataset11' };
  });

  before(() => {
    stub.start();
    stub.setDatasets(DATASETS_TWINGRAPH);
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
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    ScenarioParameters.launch({
      saveAndLaunch: true,
      runOptions,
    });
    ScenarioParameters.waitForScenarioRunEnd();
    BreweryParameters.switchToEventsTab();
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[0]);
    apiUtils.interceptPostDatasetTwingraphQuery(twingraphQueryResponse);
    selectScenarioAndWaitForScenarioViewUrlUpdate(SCENARIOS[4]);
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', 'Customer3');
  });
});
