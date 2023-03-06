import { ScenarioManager, ScenarioParameters, Scenarios } from '../../commons/actions';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import utils from '../../commons/TestUtils';
import { BreweryParameters, Login } from '../../commons/actions/brewery';

const JSON_PATH = 'dummy_json.json';
const ZIP_PATH = 'dummy_zip.zip';
const CSV_PATH = 'dummy_dataset_1.csv';
describe('upload of files in different formats', () => {
  const scenario = 'Test Cypress - File Upload - ' + utils.randomStr(7);
  before(() => {
    Login.login();
  });
  after(() => {
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.deleteScenario(scenario);
  });
  it('uploads csv, json, zip files and launch scenario', () => {
    Scenarios.createScenario(scenario, true, DATASET.BREWERY_ADT, RUN_TEMPLATE.BASIC_TYPES);
    ScenarioParameters.edit();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(JSON_PATH);
    BreweryParameters.uploadExampleDatasetPart2(ZIP_PATH);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.uploadExampleDatasetPart3(CSV_PATH);
    ScenarioParameters.updateAndLaunch();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.getExampleDatasetPart1DownloadButton().should('have.text', JSON_PATH);
    BreweryParameters.getExampleDatasetPart2DownloadButton().should('have.text', ZIP_PATH);
    BreweryParameters.switchToExtraDatasetPartTab();
    BreweryParameters.getExampleDatasetPart3DownloadButton().should('have.text', CSV_PATH);
  });
});
