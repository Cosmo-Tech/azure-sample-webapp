// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  FileParameters,
  Scenarios,
  ScenarioParameters,
  ScenarioSelector,
  TableParameters,
  Login,
} from '../../commons/actions';
import { SOLUTIONS, SCENARIOS } from '../../fixtures/stubbing/FileParametersNames';
import { stub } from '../../commons/services/stubbing';

const DUMMY_CSV = 'dummy_dataset_1.csv';
const DUMMY_JSON = 'dummy_json.json';
const FOO_TABLE_CSV = 'stubbing/FileParametersNames/foo.csv';
const FOO_TABLE_XLSX = 'stubbing/FileParametersNames/foo.xlsx';

const getFileNoRenaming = () => cy.get('[data-cy=file-upload-file_no_renaming]');
const getFileWithRenaming = () => cy.get('[data-cy=file-upload-file_with_renaming]');
const getTableNoRenaming = () => cy.get('[data-cy=table-table_no_renaming]');
const getTableWithRenaming = () => cy.get('[data-cy=table-table_with_renaming]');

const getFilePathFromDataset = (dataset) => dataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
const getDatasetFilePath = (datasetId) => getFilePathFromDataset(stub.getDatasetById(datasetId));

describe('Management of file names for scenario parameters of type file', () => {
  before(() => {
    stub.start();
    stub.setScenarios(SCENARIOS);
    stub.setSolutions(SOLUTIONS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('should respect shouldRenameFileOnUpload option in configuration of file parameters', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioSelector.selectScenario(SCENARIOS[0].name, SCENARIOS[0].id);
    ScenarioParameters.expandParametersAccordion();

    FileParameters.getFileName(getFileNoRenaming()).should('not.exist');
    FileParameters.getFileName(getFileWithRenaming()).should('not.exist');
    FileParameters.upload(getFileNoRenaming(), DUMMY_CSV);
    FileParameters.upload(getFileWithRenaming(), DUMMY_CSV);
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_CSV);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'CSV file');

    ScenarioParameters.save({
      datasetsEvents: [{ id: 'd-stbddst1' }, { id: 'd-stbddst2' }], // Force ids for stubbing of datasets creation
      updateOptions: {
        validateRequest: (req) => {
          const values = req.body.parametersValues;
          expect(values.find((el) => el.parameterId === 'file_no_renaming').value).to.equal('d-stbddst1');
          expect(getDatasetFilePath('d-stbddst1')).to.have.string(DUMMY_CSV);
          expect(values.find((el) => el.parameterId === 'file_with_renaming').value).to.equal('d-stbddst2');
          expect(getDatasetFilePath('d-stbddst2')).to.have.string('file_with_renaming.csv');
        },
      },
    });

    FileParameters.upload(getFileNoRenaming(), DUMMY_JSON);
    FileParameters.upload(getFileWithRenaming(), DUMMY_JSON);
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_JSON);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'JSON file');

    ScenarioParameters.save({
      datasetsEvents: [
        {
          id: 'd-stbddst3',
          onDatasetUpdate: (req) => expect(getFilePathFromDataset(req.body)).to.have.string(DUMMY_JSON),
        },
        {
          id: 'd-stbddst4',
          onDatasetUpdate: (req) => expect(getFilePathFromDataset(req.body)).to.have.string('file_with_renaming.json'),
        },
      ],
      updateOptions: {
        validateRequest: (req) => {
          const values = req.body.parametersValues;
          expect(values.find((el) => el.parameterId === 'file_no_renaming').value).to.equal('d-stbddst3');
          expect(getDatasetFilePath('d-stbddst3')).to.have.string(DUMMY_JSON);
          expect(values.find((el) => el.parameterId === 'file_with_renaming').value).to.equal('d-stbddst4');
          expect(getDatasetFilePath('d-stbddst4')).to.have.string('file_with_renaming.json');
        },
      },
    });

    // Check that shouldRenameFileOnUpload options has an impact on names of uploaded files
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_CSV);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_CSV);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 2);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 2);
    ScenarioParameters.save({
      datasetsEvents: [{ id: 'd-stbddst5' }, { id: 'd-stbddst6' }],
      updateOptions: {
        validateRequest: (req) => {
          const values = req.body.parametersValues;
          expect(values.find((el) => el.parameterId === 'table_no_renaming').value).to.equal('d-stbddst5');
          expect(getDatasetFilePath('d-stbddst5')).to.have.string('foo.csv');
          expect(values.find((el) => el.parameterId === 'table_with_renaming').value).to.equal('d-stbddst6');
          expect(getDatasetFilePath('d-stbddst6')).to.have.string('table_with_renaming.csv');
        },
      },
    });

    // Check that extension of XLSX files is replaced by CSV, whether the option is enabled or not
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_XLSX);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_XLSX);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 3);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 3);
    ScenarioParameters.save({
      datasetsEvents: [{ id: 'd-stbddst7' }, { id: 'd-stbddst8' }],
      updateOptions: {
        validateRequest: (req) => {
          const values = req.body.parametersValues;
          expect(values.find((el) => el.parameterId === 'table_no_renaming').value).to.equal('d-stbddst7');
          expect(getDatasetFilePath('d-stbddst7')).to.have.string('foo.csv');
          expect(values.find((el) => el.parameterId === 'table_with_renaming').value).to.equal('d-stbddst8');
          expect(getDatasetFilePath('d-stbddst8')).to.have.string('table_with_renaming.csv');
        },
      },
    });
  });
});
