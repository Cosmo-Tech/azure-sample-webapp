// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DatasetManager, Login, ScenarioParameters, Scenarios, ScenarioSelector } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils as api } from '../../commons/utils';
import {
  WORKSPACE,
  DATASETS_TO_REFRESH,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
  RUNNERS_FOR_ETL_DATASETS,
} from '../../fixtures/stubbing/DatasetManager';
import { SCENARIOS_WITH_DATASET_ERROR } from '../../fixtures/stubbing/DisableLaunchButton/scenarios';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const scenarioWithBrokenDataset = SCENARIOS_WITH_DATASET_ERROR[1];
const scenarioReadyToLaunch = SCENARIOS_WITH_DATASET_ERROR[2];
const scenarioWithoutDataset = SCENARIOS_WITH_DATASET_ERROR[3];

const refreshSuccessOptions = { expectedPollsCount: 2, finalStatus: 'Successful' };
const refreshFailedOptions = { expectedPollsCount: 2, finalStatus: 'Failed' };

describe('Disable Launch button on invalid dataset', () => {
  before(() => stub.start());

  beforeEach(() => {
    Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' });
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS_TO_REFRESH]);
    stub.setRunners([...RUNNERS_FOR_ETL_DATASETS, ...SCENARIOS_WITH_DATASET_ERROR]);
  });

  after(stub.stop);

  it('can disable and enable Launch button when dataset status changes', () => {
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioSelector.selectScenario(scenarioWithBrokenDataset.name, scenarioWithBrokenDataset.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioSelector.selectScenario(scenarioReadyToLaunch.name, scenarioReadyToLaunch.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioSelector.selectScenario(scenarioWithoutDataset.name, scenarioWithoutDataset.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    DatasetManager.ignoreDatasetQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[0].id);
    DatasetManager.refreshDataset(DATASETS_TO_REFRESH[0].id, refreshFailedOptions);
    DatasetManager.getDatasetOverviewPlaceholderTitle().contains('An error', { timeout: 30000 });
    Scenarios.switchToScenarioView();
    ScenarioSelector.selectScenario(scenarioWithBrokenDataset.name, scenarioWithBrokenDataset.id);
    ScenarioParameters.getLaunchButton().should('be.disabled');
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[0].id);
    DatasetManager.refreshDataset(DATASETS_TO_REFRESH[0].id, refreshSuccessOptions);
    DatasetManager.getRefreshDatasetSpinner(DATASETS_TO_REFRESH[0].id, 30000).should('not.exist');
    Scenarios.switchToScenarioView();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
  });
});

const FILE_PATH = 'dummy_dataset_1.csv';

describe('Disable Launch button on scenario save', () => {
  before(() => stub.start());
  beforeEach(() => {
    Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' });
    stub.setWorkspaces([WORKSPACE]);
  });
  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('must show the spinner and backdrop elements in the scenario view to block the Launch button', () => {
    ScenarioSelector.selectScenario(BASIC_PARAMETERS_SIMULATION_RUNNER.name, BASIC_PARAMETERS_SIMULATION_RUNNER.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');

    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToDatasetPartsTab();
    BreweryParameters.uploadExampleDatasetPart1(FILE_PATH);
    BreweryParameters.uploadExampleDatasetPart2(FILE_PATH);
    const reqSaveAliases = ScenarioParameters.save({
      wait: false,
      datasetPartEvents: [{ id: 'dp-datasetPart1' }, { id: 'dp-datasetPart2' }],
    });

    Scenarios.getScenarioBackdrop().should('be.visible');
    api.waitAliases(reqSaveAliases);
    // Check that the backdrop only disappears after the API calls (it should thus still be visible for a short)
    Scenarios.getScenarioBackdrop().should('be.visible');
    Scenarios.getScenarioBackdrop(10).should('not.be.visible');
  });
});
