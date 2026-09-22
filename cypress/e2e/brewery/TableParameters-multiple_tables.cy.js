// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login } from '../../commons/actions/brewery';
import { ScenarioParameters, ScenarioSelector, TableParameters } from '../../commons/actions/generic';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  CHILD_BASE_DATASET,
  CHILD_EDITABLE_TABLE_PART_ID,
  CHILD_RUNNER,
  PARENT_BASE_DATASET,
  PARENT_EDITABLE_TABLE_PART_ID,
  PARENT_RUNNER,
  ROOT_EDITABLE_TABLE_PART_ID,
  ROOT_RUNNER,
  ROOT_TABLE_PART_ID,
  SOLUTION_WITH_TWO_TABLES,
} from '../../fixtures/stubbing/TableParameters-multiple_tables';
import { DEFAULT_RUNNER_BASE_DATASET, DEFAULT_WORKSPACE } from '../../fixtures/stubbing/default';

const PARENT_DYNAMIC_TABLE_QUERY_RESPONSE = 'product,stock\nWidgetParent,1';
const PARENT_EDITABLE_TABLE_CSV = 'item,quantity\nParentItem,0';
const CHILD_DYNAMIC_TABLE_QUERY_RESPONSE = 'product,stock\nWidgetChild,42';
const CHILD_EDITABLE_TABLE_CSV = 'item,quantity\nChildItem,7';
const ROOT_TABLE_CSV = 'name,value\nRootItem,99';

const getDynamicTable = () => cy.get('[data-cy=table-dynamic_table]');
const getEditableTable = () => cy.get('[data-cy=table-editable_table]');
const getRootTable = () => cy.get('[data-cy=table-root_table]');

// TODO: we shouldn't need to intercept these queries so many times, it may be cause only by the cypress test
// behavior (the page refresh during login) but it might also be caused by the webapp (too many renders? no lock
// on the dynamic queries?)
const TABLE_QUERY_INTERCEPTION_COUNT = 3;

describe('Table parameters with multiple tables in one group, opened directly on a child scenario', () => {
  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION_WITH_TWO_TABLES]);
    stub.setDatasets([DEFAULT_RUNNER_BASE_DATASET, PARENT_BASE_DATASET, CHILD_BASE_DATASET]);
    stub.setRunners([ROOT_RUNNER, PARENT_RUNNER, CHILD_RUNNER]);
    stub.addDatasetPartFile(CHILD_EDITABLE_TABLE_PART_ID, CHILD_EDITABLE_TABLE_CSV);
    stub.addDatasetPartFile(ROOT_TABLE_PART_ID, ROOT_TABLE_CSV);
  });

  after(() => stub.stop());

  it('displays the child scenario data when the webapp is opened directly on it via URL', () => {
    apiUtils.interceptPostDatasetQuery(
      {},
      (req) => {
        throw new Error('Query to parent scenario must not be called');
      },
      1,
      {
        datasetId: PARENT_BASE_DATASET.id,
        datasetPartId: CHILD_BASE_DATASET.parts[0].id, // Only intercept mismatch queries with parent & child ids
      }
    );
    apiUtils.interceptDownloadDatasetPart({
      datasetId: PARENT_RUNNER.datasets.parameter,
      datasetPartId: CHILD_EDITABLE_TABLE_PART_ID, // Only intercept mismatch queries with parent & child ids
      validateRequest: (req) => {
        throw new Error('Query to parent scenario must not be called');
      },
    });

    let hasDatasetPostQueryBeenCalled = false;
    apiUtils.interceptPostDatasetQuery(
      CHILD_DYNAMIC_TABLE_QUERY_RESPONSE,
      (req) => (hasDatasetPostQueryBeenCalled = true),
      TABLE_QUERY_INTERCEPTION_COUNT,
      {
        datasetId: CHILD_BASE_DATASET.id,
        datasetPartId: CHILD_BASE_DATASET.parts[0].id,
      }
    );
    let hasDatasetPartDownloadBeenCalled = false;
    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: CHILD_EDITABLE_TABLE_PART_ID,
      fileContent: CHILD_EDITABLE_TABLE_CSV,
      validateRequest: (req) => {
        hasDatasetPartDownloadBeenCalled = true;
        expect(req.url).to.include(CHILD_RUNNER.datasets.parameter);
      },
      times: TABLE_QUERY_INTERCEPTION_COUNT,
    });

    Login.login({
      url: `${DEFAULT_WORKSPACE.id}/scenario/${CHILD_RUNNER.id}`,
      scenarioId: CHILD_RUNNER.id,
    });

    cy.then(() => expect(hasDatasetPostQueryBeenCalled).to.be.true);
    cy.then(() => expect(hasDatasetPartDownloadBeenCalled).to.be.true);

    ScenarioParameters.expandParametersAccordion();
    TableParameters.getLoadingSpinner(getDynamicTable()).should('not.exist');
    TableParameters.getCell(getDynamicTable(), 'product', 0).should('have.text', 'WidgetChild');
    TableParameters.getCell(getDynamicTable(), 'stock', 0).should('have.text', '42');

    TableParameters.getLoadingSpinner(getEditableTable()).should('not.exist');
    TableParameters.getCell(getEditableTable(), 'item', 0).should('have.text', 'ChildItem');
    TableParameters.getCell(getEditableTable(), 'quantity', 0).should('have.text', '7');

    let hasParentDatasetPostQueryBeenCalled = false;
    apiUtils.interceptPostDatasetQuery(
      PARENT_DYNAMIC_TABLE_QUERY_RESPONSE,
      (req) => (hasParentDatasetPostQueryBeenCalled = true),
      1,
      {
        datasetId: PARENT_BASE_DATASET.id,
        datasetPartId: PARENT_BASE_DATASET.parts[0].id,
      }
    );

    let hasParentDatasetPartDownloadBeenCalled = false;
    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: PARENT_EDITABLE_TABLE_PART_ID,
      fileContent: PARENT_EDITABLE_TABLE_CSV,
      validateRequest: (req) => {
        hasParentDatasetPartDownloadBeenCalled = true;
        expect(req.url).to.include(PARENT_RUNNER.datasets.parameter);
      },
      times: 1,
    });

    // Switch to parent scenario & check tables
    ScenarioSelector.selectScenario(PARENT_RUNNER.name, PARENT_RUNNER.id);

    TableParameters.getLoadingSpinner(getDynamicTable()).should('not.exist');
    TableParameters.getCell(getDynamicTable(), 'product', 0).should('have.text', 'WidgetParent');
    TableParameters.getCell(getDynamicTable(), 'stock', 0).should('have.text', '1');

    TableParameters.getLoadingSpinner(getEditableTable()).should('not.exist');
    TableParameters.getCell(getEditableTable(), 'item', 0).should('have.text', 'ParentItem');
    TableParameters.getCell(getEditableTable(), 'quantity', 0).should('have.text', '0');

    cy.then(() => expect(hasParentDatasetPostQueryBeenCalled).to.be.true);
    cy.then(() => expect(hasParentDatasetPartDownloadBeenCalled).to.be.true);

    let hasRootDatasetPartDownloadBeenCalled = false;
    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: ROOT_TABLE_PART_ID,
      fileContent: ROOT_TABLE_CSV,
      validateRequest: (req) => {
        hasRootDatasetPartDownloadBeenCalled = true;
        expect(req.url).to.include(ROOT_RUNNER.datasets.parameter);
      },
      times: 1,
    });

    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: ROOT_EDITABLE_TABLE_PART_ID,
      validateRequest: (req) => {
        throw new Error('Query for the hidden root editable table must not be called');
      },
    });

    // Switch to root scenario to check that its hidden table parameter has no impact on ohter scenarios
    ScenarioSelector.selectScenario(ROOT_RUNNER.name, ROOT_RUNNER.id);
    getEditableTable().should('not.exist');

    TableParameters.getLoadingSpinner(getRootTable()).should('not.exist');
    TableParameters.getCell(getRootTable(), 'name', 0).should('have.text', 'RootItem');
    TableParameters.getCell(getRootTable(), 'value', 0).should('have.text', '99');

    cy.then(() => expect(hasRootDatasetPartDownloadBeenCalled).to.be.true);

    // Switch back to child scenario
    ScenarioSelector.selectScenario(CHILD_RUNNER.name, CHILD_RUNNER.id);

    TableParameters.getLoadingSpinner(getDynamicTable()).should('not.exist');
    TableParameters.getCell(getDynamicTable(), 'product', 0).should('have.text', 'WidgetChild');
    TableParameters.getCell(getDynamicTable(), 'stock', 0).should('have.text', '42');

    TableParameters.getLoadingSpinner(getEditableTable()).should('not.exist');
    TableParameters.getCell(getEditableTable(), 'item', 0).should('have.text', 'ChildItem');
    TableParameters.getCell(getEditableTable(), 'quantity', 0).should('have.text', '7');
  });
});
