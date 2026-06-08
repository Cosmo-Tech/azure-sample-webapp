// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager, TableParameters } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DATASETS,
  WORKSPACE,
  DATASET_A_KPI_QUERIES,
  DATASET_B_KPI_QUERIES,
  DATASET_B_TABLE_DECODED_RESPONSE,
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
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('Dataset overview launches Cypher queries and has results', () => {
    const DATASET_A = DATASETS[0];
    const DATASET_B = DATASETS[1];

    DatasetManager.switchToDatasetManagerView(DATASET_A_KPI_QUERIES);
    DatasetManager.getDatasetNameInOverview().should('have.text', DATASET_A.name);
    DatasetManager.selectDatasetById(DATASET_B.id, DATASET_B_KPI_QUERIES);
    DatasetManager.getDatasetNameInOverview().should('have.text', DATASET_B.name);
    DatasetManager.getIndicatorKpiLabel(DatasetManager.getIndicatorCard('entities')).should('have.text', 'Entities');
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('entities')).should('have.text', 21);
    DatasetManager.getIndicatorKpiLabel(DatasetManager.getIndicatorCard('relationships')).should(
      'have.text',
      'Relationships'
    );
    DatasetManager.getKpiValue(DatasetManager.getIndicatorCard('relationships')).should('have.text', 42);

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
    DatasetManager.openCategoryDetailsDialog('transport', DATASET_B_TABLE_DECODED_RESPONSE);
    DatasetManager.getCategoryDetailsDialog().should('exist').should('be.visible');

    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi1')).should('have.text', 'My KPI #1');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi1')).should('have.text', 3);
    DatasetManager.getCategoryKpiLabel(getTransportKpi('transport_kpi2')).should('have.text', 'My KPI #2');
    DatasetManager.getKpiValue(getTransportKpi('transport_kpi2')).should('have.text', 5);

    DatasetManager.getDetailsDialogCategoryName().should('have.text', 'transport');
    DatasetManager.getDetailsDialogDatasetName().should('have.text', DATASET_B.name);
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
