// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login } from '../../commons/actions/brewery';
import { ScenarioParameters, TableParameters } from '../../commons/actions/generic';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  CHILD_BASE_DATASET,
  CHILD_EDITABLE_TABLE_PART_ID,
  CHILD_RUNNER,
  PARENT_BASE_DATASET,
  PARENT_RUNNER,
  SOLUTION_WITH_TWO_TABLES,
} from '../../fixtures/stubbing/TableParameters-multiple_tables';
import { DEFAULT_WORKSPACE } from '../../fixtures/stubbing/default';

const CHILD_DYNAMIC_TABLE_QUERY_RESPONSE = 'product,stock\nWidgetChild,42';
const CHILD_EDITABLE_TABLE_CSV = 'item,quantity\nChildItem,7';

const getDynamicTable = () => cy.get('[data-cy=table-dynamic_table]');
const getEditableTable = () => cy.get('[data-cy=table-editable_table]');

describe('Table parameters with multiple tables in one group, opened directly on a child scenario', () => {
  before(() => {
    stub.start();
    stub.setSolutions([SOLUTION_WITH_TWO_TABLES]);
    stub.setDatasets([PARENT_BASE_DATASET, CHILD_BASE_DATASET]);
    stub.setRunners([PARENT_RUNNER, CHILD_RUNNER]);
    stub.addDatasetPartFile(CHILD_EDITABLE_TABLE_PART_ID, CHILD_EDITABLE_TABLE_CSV);
  });

  after(() => stub.stop());

  it('displays the child scenario data when the webapp is opened directly on it via URL', () => {
    // Guards against the dynamic query being sent against the parent's dataset instead of the child's
    apiUtils.interceptPostDatasetQuery(CHILD_DYNAMIC_TABLE_QUERY_RESPONSE, (req) =>
      expect(req.url).to.include(CHILD_BASE_DATASET.id)
    );
    // Scoped to the child's dataset part id: would not intercept a download of the parent's part
    apiUtils.interceptDownloadDatasetPart({
      datasetPartId: CHILD_EDITABLE_TABLE_PART_ID,
      fileContent: CHILD_EDITABLE_TABLE_CSV,
    });

    Login.login({
      url: `${DEFAULT_WORKSPACE.id}/scenario/${CHILD_RUNNER.id}`,
      scenarioId: CHILD_RUNNER.id,
    });

    ScenarioParameters.expandParametersAccordion();
    // cy.get('[data-cy=two_tables_group_tab]').click({ force: true });

    TableParameters.getLoadingSpinner(getDynamicTable()).should('not.exist');
    TableParameters.getCell(getDynamicTable(), 'product', 0).should('have.text', 'WidgetChild');
    TableParameters.getCell(getDynamicTable(), 'stock', 0).should('have.text', '42');

    TableParameters.getLoadingSpinner(getEditableTable()).should('not.exist');
    TableParameters.getCell(getEditableTable(), 'item', 0).should('have.text', 'ChildItem');
    TableParameters.getCell(getEditableTable(), 'quantity', 0).should('have.text', '7');
  });
});
