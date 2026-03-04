// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  Downloads,
  FileParameters,
  Scenarios,
  ScenarioParameters,
  ScenarioSelector,
  TableParameters,
  Login,
} from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { fileUtils } from '../../commons/utils';
import { EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD } from '../../fixtures/FileParametersData';
import { SOLUTIONS, SCENARIOS } from '../../fixtures/stubbing/FileParametersNames';

const DUMMY_CSV = 'dummy_dataset_1.csv';
const DUMMY_JSON = 'dummy_json.json';
const FOO_TABLE_CSV = 'stubbing/FileParametersNames/foo.csv';
const FOO_TABLE_XLSX = 'stubbing/FileParametersNames/foo.xlsx';

const getFileNoRenaming = () => cy.get('[data-cy=file-upload-file_no_renaming]');
const getFileWithRenaming = () => cy.get('[data-cy=file-upload-file_with_renaming]');
const getTableNoRenaming = () => cy.get('[data-cy=table-table_no_renaming]');
const getTableWithRenaming = () => cy.get('[data-cy=table-table_with_renaming]');

const getFormDataFromRequest = (req) => {
  const serializedFormData = fileUtils.parseMultipartFormData(req.body)?.datasetPartCreateRequest;
  return JSON.parse(serializedFormData);
};

// FIXME: the option shouldRenameFileOnUpload may no longer be necessary since v7, because the dataset part can hold
// both the file name (sourceName) and the parameter id (name)
describe('Management of file names for scenario parameters of type file', () => {
  before(() => {
    stub.start();
    stub.setRunners(SCENARIOS);
    stub.setSolutions(SOLUTIONS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    Downloads.clearDownloadsFolder();
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
      datasetPartEvents: [
        {
          id: 'dp-datasetPart1',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(DUMMY_CSV),
        },
        {
          id: 'dp-datasetPart2',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(DUMMY_CSV),
        },
      ],
    });

    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_CSV);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'CSV file');
    FileParameters.download(getFileNoRenaming());
    FileParameters.download(getFileWithRenaming());
    Downloads.checkByContent(DUMMY_CSV, EXPECTED_DATA_AFTER_DUMMY_DATASET_1_UPLOAD);

    FileParameters.upload(getFileNoRenaming(), DUMMY_JSON);
    FileParameters.upload(getFileWithRenaming(), DUMMY_JSON);
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_JSON);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'JSON file');

    ScenarioParameters.save({
      datasetPartEvents: [
        {
          id: 'dp-datasetPart3',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(DUMMY_JSON),
        },
        {
          id: 'dp-datasetPart4',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal(DUMMY_JSON),
        },
        // Dataset parts previously existing must be deleted
        { id: 'dp-datasetPart1', delete: true },
        { id: 'dp-datasetPart2', delete: true },
      ],
    });

    // Check that shouldRenameFileOnUpload options has an impact on names of uploaded files
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_CSV);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_CSV);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 2);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 2);
    ScenarioParameters.save({
      datasetPartEvents: [
        // Webapp bug PROD-15499: dataset parts are re-uploaded even if they've not changed
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded3' },
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded4' },

        // For tables "sourceName" must be the parameter id
        {
          id: 'dp-datasetPart5',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal('table_no_renaming'),
        },
        {
          id: 'dp-datasetPart6',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal('table_with_renaming'),
        },
        // Webapp bug PROD-15499: dataset parts are re-uploaded even if they've not changed
        { id: 'dp-datasetPart3', delete: true },
        { id: 'dp-datasetPart4', delete: true },
      ],
    });

    // Check that extension of XLSX files is replaced by CSV, whether the option is enabled or not
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_XLSX);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_XLSX);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 3);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 3);
    ScenarioParameters.save({
      datasetPartEvents: [
        // Webapp bug PROD-15499: dataset parts are re-uploaded even if they've not changed
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded5' },
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded6' },

        // For tables "sourceName" must be the parameter id
        {
          id: 'dp-datasetPart7',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal('table_no_renaming'),
        },
        {
          id: 'dp-datasetPart8',
          validateRequest: (req) => expect(getFormDataFromRequest(req)?.sourceName).to.equal('table_with_renaming'),
        },

        // Webapp bug PROD-15499: dataset parts are re-uploaded even if they've not changed
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded3', delete: true },
        { id: 'dp-bug_datasetPartThatShouldntBeReuploaded4', delete: true },

        // Dataset parts previously existing must be deleted
        { id: 'dp-datasetPart5', delete: true },
        { id: 'dp-datasetPart6', delete: true },
      ],
    });
  });
});
