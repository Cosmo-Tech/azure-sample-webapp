// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager, TableParameters } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DATASETS_TWINGRAPH,
  SOLUTION,
  WORKSPACE,
  TWINGRAPH_QUERIES,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
} from '../../fixtures/stubbing/DatasetManager';

const getTransportAccordionSummary = () => DatasetManager.getCategoryAccordionSummary('transport');
const getTransportAccordionDetails = () => DatasetManager.getCategoryAccordionDetails('transport');
const getTransportKpi = (kpi) => DatasetManager.getCategoryKpi(getTransportAccordionDetails(), kpi);

const getTableTransport = () => cy.get(`[data-cy=table-transport]`);

describe('Dataset manager overview works correctly', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets(DATASETS_TWINGRAPH);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('Dataset overview launches Cypher queries and has results', () => {
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.getDatasetNameInOverview().should('have.text', DATASETS_TWINGRAPH[0].name);
    DatasetManager.selectDatasetById(DATASETS_TWINGRAPH[1].id, [
      TWINGRAPH_QUERIES[0],
      TWINGRAPH_QUERIES[1],
      TWINGRAPH_QUERIES[2],
      TWINGRAPH_QUERIES[3],
    ]);
    DatasetManager.getDatasetNameInOverview().should('have.text', DATASETS_TWINGRAPH[1].name);
    DatasetManager.getIndicatorKpiLabel(DatasetManager.getIndicatorCard('entities')).should('have.text', 'Entities');
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('entities')).should(
      'have.text',
      TWINGRAPH_QUERIES[0].results[0].entities
    );
    DatasetManager.getIndicatorKpiLabel(DatasetManager.getIndicatorCard('relationships')).should(
      'have.text',
      'Relationships'
    );
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('relationships')).should(
      'have.text',
      TWINGRAPH_QUERIES[1].results[0].relationships
    );

    DatasetManager.getCategoryName(getTransportAccordionSummary()).should('have.text', 'transport');
    DatasetManager.getCategoryType(getTransportAccordionSummary()).should('have.text', 'Relationship');
    getTransportAccordionSummary().click();
    DatasetManager.getCategoryDescription(getTransportAccordionDetails()).should(
      'have.text',
      'Transport category description'
    );
    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi1')).should('have.text', 'My KPI #1');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi1')).should('have.text', 3);
    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi2')).should('have.text', 'My KPI #2');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi2')).should('have.text', 5);

    DatasetManager.getCategoryDetailsDialog().should('not.exist');
    DatasetManager.openCategoryDetailsDialog('transport', TWINGRAPH_QUERIES[4].results);
    DatasetManager.getCategoryDetailsDialog().should('exist').should('be.visible');

    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi1')).should('have.text', 'My KPI #1');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi1')).should('have.text', 3);
    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi2')).should('have.text', 'My KPI #2');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi2')).should('have.text', 5);

    DatasetManager.getDetailsDialogCategoryName().should('have.text', 'transport');
    DatasetManager.getDetailsDialogDatasetName().should('have.text', DATASETS_TWINGRAPH[1].name);
    TableParameters.getRows(getTableTransport()).should('have.length', 4);
    TableParameters.getHeaderCell(getTableTransport(), 'name').should('be.visible');
    TableParameters.getHeaderCell(getTableTransport(), 'source').should('be.visible');
    TableParameters.getHeaderCell(getTableTransport(), 'destination').should('be.visible');

    TableParameters.getCell(getTableTransport(), 'name', 0).should('have.text', 'car');
    TableParameters.getCell(getTableTransport(), 'source', 1).should('have.text', 'Paris');
    TableParameters.getCell(getTableTransport(), 'destination', 2).should('have.text', 'Nice');
    TableParameters.getCell(getTableTransport(), 'name', 3).should('have.text', 'boat');

    DatasetManager.closeCategoryDetailsDialog();
    DatasetManager.getCategoryDetailsDialog().should('not.exist');
  });
});
