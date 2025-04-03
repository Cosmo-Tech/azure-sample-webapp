// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DatasetManager, Login, ScenarioParameters, Scenarios, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  WORKSPACE,
  DATASETS_TO_REFRESH,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
} from '../../fixtures/stubbing/DatasetManager';
import { SCENARIOS_WITH_DATASET_ERROR } from '../../fixtures/stubbing/DisableLaunchButton/scenarios';

describe('DisableLaunchButton', () => {
  stub.start();
  stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
  stub.setWorkspaces([WORKSPACE]);
  stub.setDatasets([...DATASETS_TO_REFRESH]);
  stub.setScenarios(SCENARIOS_WITH_DATASET_ERROR);

  const scenarioWithBrokenDataset = SCENARIOS_WITH_DATASET_ERROR[1];
  const scenarioReadyToLaunch = SCENARIOS_WITH_DATASET_ERROR[2];
  const scenarioWithoutDataset = SCENARIOS_WITH_DATASET_ERROR[3];

  const refreshSuccessOptions = {
    expectedPollsCount: 2,
    finalIngestionStatus: 'SUCCESS',
  };

  const refreshFailedOptions = {
    expectedPollsCount: 2,
    finalIngestionStatus: 'ERROR',
  };

  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);
  it('can disable and enable Launch button when dataset status changes', () => {
    ScenarioParameters.getLaunchButton().should('be.disabled');
    ScenarioSelector.selectScenario(scenarioWithBrokenDataset.name, scenarioWithBrokenDataset.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioSelector.selectScenario(scenarioReadyToLaunch.name, scenarioReadyToLaunch.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    ScenarioSelector.selectScenario(scenarioWithoutDataset.name, scenarioWithoutDataset.id);
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
    DatasetManager.ignoreDatasetTwingraphQueries();
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[1].id);
    DatasetManager.refreshDataset(DATASETS_TO_REFRESH[1].id, refreshFailedOptions);
    DatasetManager.getDatasetOverviewPlaceholderTitle().contains('An error', { timeout: 30000 });
    Scenarios.switchToScenarioView();
    ScenarioSelector.selectScenario(scenarioWithBrokenDataset.name, scenarioWithBrokenDataset.id);
    ScenarioParameters.getLaunchButton().should('be.disabled');
    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASETS_TO_REFRESH[1].id);
    DatasetManager.refreshDataset(DATASETS_TO_REFRESH[1].id, refreshSuccessOptions);
    DatasetManager.getRefreshDatasetSpinner(DATASETS_TO_REFRESH[1].id, 30000).should('not.exist');
    Scenarios.switchToScenarioView();
    ScenarioParameters.getLaunchButton().should('not.be.disabled');
  });
});
