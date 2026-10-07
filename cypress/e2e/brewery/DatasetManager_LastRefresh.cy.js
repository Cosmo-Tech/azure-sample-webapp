// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { DatasetManager, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DATASETS, RUNNERS, SOLUTION, WORKSPACE } from '../../fixtures/stubbing/DatasetManagerParametersEdition';
import { DEFAULT_DATASET } from '../../fixtures/stubbing/default';

const clone = rfdc();

const FILE_DATASET_ID = 'D-lastRefreshFile';
const FILE_PART_ID = 'dp-lastRefreshFile';
const ETL_DATASET_ID = DATASETS[4].id;
const ETL_RUNNER = clone(RUNNERS[1]);
const ETL_RUNNER_ID = RUNNERS[1].id;
ETL_RUNNER.datasets.bases = [ETL_DATASET_ID];

const OLD_TIMESTAMP = '2027-01-01T00:00:00.000Z';
const PART_TIMESTAMP = '2027-01-03T00:00:00.000Z';
const UPDATED_PART_TIMESTAMP = '2027-01-05T00:00:00.000Z';
const RUNNER_TIMESTAMP = '2027-01-02T00:00:00.000Z';
const UPDATED_RUNNER_TIMESTAMP = '2027-01-04T00:00:00.000Z';
const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString('en-US', { timeZone: 'UTC' });
const parseIsoStringToTimestamp = (isoString) => Date.parse(isoString);
const getStockParameterInput = () => cy.get('[data-cy=text-input-etl_stock]').find('input');

const getFileDataset = () => ({
  ...DEFAULT_DATASET,
  id: FILE_DATASET_ID,
  name: 'File upload dataset',
  workspaceId: WORKSPACE.id,
  additionalData: {
    webapp: {
      visible: { datasetManager: true, scenarioCreation: true },
      sourceType: 'FileUploadToDataset',
    },
  },
  parts: [
    {
      id: FILE_PART_ID,
      name: 'customers.csv',
      sourceName: 'customers.csv',
      type: 'File',
      updateInfo: { timestamp: parseIsoStringToTimestamp(OLD_TIMESTAMP) },
    },
  ],
});

const ETL_DATASET = {
  ...DATASETS[4],
  workspaceId: WORKSPACE.id,
  parts: [
    {
      id: 'dp-lastRefreshEtl',
      name: 'customers',
      type: 'DB',
      updateInfo: { timestamp: parseIsoStringToTimestamp(PART_TIMESTAMP) },
    },
  ],
};

const configureStub = () => {
  stub.reset();
  stub.setSolutions([SOLUTION]);
  stub.setWorkspaces([WORKSPACE]);
  stub.setDatasets([...DATASETS, getFileDataset()]);
  stub.setRunners([...RUNNERS]);
};

const assertRefreshDate = (timestamp) =>
  DatasetManager.getDatasetMetadataRefreshDate().should('contain.text', formatTimestamp(timestamp));

describe('Dataset Manager - Last refresh date - no dataset parts', () => {
  before(() => stub.start());
  beforeEach(() => {
    configureStub();
    Login.login({ url: `/${WORKSPACE.id}/datasetmanager`, workspaceId: WORKSPACE.id, isPowerBiEnabled: false });
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('updates after a file replacement and remains updated after reload', () => {
    const replacementTimestamp = '2027-02-01T00:00:00.000Z';
    const replacementPart = {
      id: 'dp-lastRefreshFileReplacement',
      name: 'customers.csv',
      sourceName: 'customers.csv',
      type: 'File',
      datasetId: FILE_DATASET_ID,
      updateInfo: { timestamp: parseIsoStringToTimestamp(replacementTimestamp) },
    };

    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.selectDatasetById(FILE_DATASET_ID);
    assertRefreshDate(OLD_TIMESTAMP);

    DatasetManager.reuploadDataset(FILE_DATASET_ID, FILE_PART_ID, replacementPart, 'cypress/fixtures/customers.csv');
    assertRefreshDate(replacementTimestamp);
  });

  it('shows the updated ETL parameter timestamp immediately if dataset has no parts', () => {
    const etlDataset = DATASETS[4];

    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.selectDatasetById(etlDataset.id);

    DatasetManager.openUpdateDatasetParametersDialog();
    getStockParameterInput().click().type('{selectAll}{backspace}98');
    DatasetManager.updateDatasetParameters(etlDataset.id, {
      customRunnerPatch: { updateInfo: { timestamp: parseIsoStringToTimestamp(UPDATED_RUNNER_TIMESTAMP) } },
      importJobOptions: { expectedPollsCount: 2 },
    });
    assertRefreshDate(UPDATED_RUNNER_TIMESTAMP); // During run
    DatasetManager.getRefreshDatasetSpinner(etlDataset.id, 20).should('not.exist');
    assertRefreshDate(UPDATED_RUNNER_TIMESTAMP); // After run has ended
  });
});

describe('Dataset Manager - Last refresh date - with dataset parts', () => {
  before(() => stub.start());
  beforeEach(() => {
    configureStub();
    const runner = {
      ...ETL_RUNNER,
      updateInfo: { timestamp: parseIsoStringToTimestamp(RUNNER_TIMESTAMP) },
      lastRunInfo: { lastRunId: 'run-lastRefresh', lastRunStatus: 'Successful' },
    };
    stub.setDatasets([...DATASETS.filter((item) => item.id !== ETL_DATASET_ID), ETL_DATASET, getFileDataset()]);
    stub.setRunners([...RUNNERS.filter((item) => item.id !== ETL_RUNNER_ID), runner]);
    Login.login({ url: `/${WORKSPACE.id}/datasetmanager`, workspaceId: WORKSPACE.id, isPowerBiEnabled: false });
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('uses the runner timestamp while running, and the latest part timestamp after success', () => {
    DatasetManager.switchToDatasetManagerView([], { interceptDatasetQueries: false });
    DatasetManager.selectDatasetById(ETL_DATASET_ID);
    assertRefreshDate(PART_TIMESTAMP); // Before ETL run

    DatasetManager.openUpdateDatasetParametersDialog();
    getStockParameterInput().click().type('{selectAll}{backspace}98');
    DatasetManager.updateDatasetParameters(ETL_DATASET.id, {
      customRunnerPatch: { updateInfo: { timestamp: parseIsoStringToTimestamp(UPDATED_RUNNER_TIMESTAMP) } },
      importJobOptions: { expectedPollsCount: 2 },
    });

    // Simulate ETL modifying parts of the selected dataset
    const newParts = [
      {
        id: 'dp-lastRefreshEtl',
        name: 'updatedCustomers',
        type: 'DB',
        updateInfo: { timestamp: parseIsoStringToTimestamp(UPDATED_PART_TIMESTAMP) },
      },
    ];
    stub.patchDataset(ETL_DATASET_ID, { parts: newParts });

    DatasetManager.getRefreshDatasetSpinner(ETL_DATASET.id, 20).should('not.exist');
    assertRefreshDate(UPDATED_PART_TIMESTAMP); // After run has ended
  });
});
