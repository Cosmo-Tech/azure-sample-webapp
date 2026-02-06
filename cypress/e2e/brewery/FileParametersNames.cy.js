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
import { stub } from '../../commons/services/stubbing';
import { fileUtils } from '../../commons/utils/fileUtils';
import { SOLUTIONS, SCENARIOS } from '../../fixtures/stubbing/FileParametersNames';

const DUMMY_CSV = 'dummy_dataset_1.csv';
const DUMMY_JSON = 'dummy_json.json';
const FOO_TABLE_CSV = 'stubbing/FileParametersNames/foo.csv';
const FOO_TABLE_XLSX = 'stubbing/FileParametersNames/foo.xlsx';

const getFileNoRenaming = () => cy.get('[data-cy=file-upload-file_no_renaming]');
const getFileWithRenaming = () => cy.get('[data-cy=file-upload-file_with_renaming]');
const getTableNoRenaming = () => cy.get('[data-cy=table-table_no_renaming]');
const getTableWithRenaming = () => cy.get('[data-cy=table-table_with_renaming]');

// Helper to parse the datasetPartCreateRequest from multipart form data
const parseDatasetPartRequest = (reqBody) => {
  const form = fileUtils.parseMultipartFormData(reqBody);
  try {
    return JSON.parse(form.datasetPartCreateRequest);
  } catch (e) {
    return form;
  }
};

// Creates an event that accepts any request (for parameters we don't need to validate)
const anyPartEvent = (id) => ({ id });

describe('Management of file names for scenario parameters of type file', () => {
  before(() => {
    stub.start();
    stub.setScenarios(SCENARIOS);
    stub.setRunners(SCENARIOS);
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
    // Display name shows original filename for file_no_renaming, and generic label for file_with_renaming
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_CSV);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'CSV file');

    // First save: upload CSV files (2 file parameters modified)
    // The part.name is the parameter ID, and sourceName is the original file name
    ScenarioParameters.save({
      datasetPartsEvents: [
        {
          id: 'dp-stbddataset01',
          validateRequest: (req) => {
            const partRequest = parseDatasetPartRequest(req.body);
            expect(partRequest.name).to.equal('file_no_renaming');
            expect(partRequest.sourceName).to.equal(DUMMY_CSV);
          },
        },
        {
          id: 'dp-stbddataset02',
          validateRequest: (req) => {
            const partRequest = parseDatasetPartRequest(req.body);
            expect(partRequest.name).to.equal('file_with_renaming');
            // sourceName is the original file name, part.name is the parameter ID
            expect(partRequest.sourceName).to.equal(DUMMY_CSV);
          },
        },
      ],
    });

    // Verify file names are displayed correctly after save
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_CSV);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'CSV file');

    // Upload new files (JSON)
    FileParameters.upload(getFileNoRenaming(), DUMMY_JSON);
    FileParameters.upload(getFileWithRenaming(), DUMMY_JSON);
    FileParameters.getFileName(getFileNoRenaming()).should('have.text', DUMMY_JSON);
    FileParameters.getFileName(getFileWithRenaming()).should('have.text', 'JSON file');

    // Second save: upload JSON files (2 file parameters modified)
    ScenarioParameters.save({
      datasetPartsEvents: [
        {
          id: 'dp-stbddataset03',
          validateRequest: (req) => {
            const partRequest = parseDatasetPartRequest(req.body);
            expect(partRequest.name).to.equal('file_no_renaming');
            expect(partRequest.sourceName).to.equal(DUMMY_JSON);
          },
        },
        {
          id: 'dp-stbddataset04',
          validateRequest: (req) => {
            const partRequest = parseDatasetPartRequest(req.body);
            expect(partRequest.name).to.equal('file_with_renaming');
            expect(partRequest.sourceName).to.equal(DUMMY_JSON);
          },
        },
      ],
    });

    // Check that shouldRenameFileOnUpload options has an impact on names of uploaded table files
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_CSV);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_CSV);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 2);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 2);

    // Third save: upload table CSV files
    // Note: File parameters are also re-uploaded because their state isn't fully cleared after save
    ScenarioParameters.save({
      datasetPartsEvents: [
        { id: 'dp-stbddataset05' },
        { id: 'dp-stbddataset06' },
        { id: 'dp-stbddataset07' },
        { id: 'dp-stbddataset08' },
      ],
    });

    // Check that extension of XLSX files is replaced by CSV, whether the option is enabled or not
    TableParameters.importFile(getTableNoRenaming(), FOO_TABLE_XLSX);
    TableParameters.importFile(getTableWithRenaming(), FOO_TABLE_XLSX);
    TableParameters.getRows(getTableNoRenaming()).should('have.length', 3);
    TableParameters.getRows(getTableWithRenaming()).should('have.length', 3);

    // Fourth save: upload table XLSX files converted to CSV
    ScenarioParameters.save({
      datasetPartsEvents: [
        { id: 'dp-stbddataset09' },
        { id: 'dp-stbddataset10' },
        { id: 'dp-stbddataset11' },
        { id: 'dp-stbddataset12' },
      ],
    });
  });
});
