// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { DATASETS, WORKSPACE } from '../../fixtures/stubbing/DatasetManager';
import { RUNNERS_FOR_ETL_DATASETS } from '../../fixtures/stubbing/DatasetManager/runners';

const DATASET_NO_RUNNER = DATASETS[0]; // DATASETS[0] = FILE_DATASET_MAIN_A, no runnerId, button disabled
const DATASET_ETL = DATASETS[3]; // DATASETS[3] = ETL_DATASET, runnerId: 'r-stbdrnr1', button enabled
const ETL_RUNNER_ID = 'r-stbdrnr1';
const ETL_LAST_RUN_ID = 'run-stbdlastrun';

describe('Dataset manager - download ETL logs button', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
    stub.setRunners(RUNNERS_FOR_ETL_DATASETS);
  });

  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));

  after(() => stub.stop());

  it('shows download logs button enabled or disabled based on dataset type', () => {
    DatasetManager.ignoreDatasetQueries();
    DatasetManager.switchToDatasetManagerView();

    DatasetManager.selectDatasetById(DATASET_NO_RUNNER.id);
    DatasetManager.getDownloadETLLogsButton().should('be.visible');
    DatasetManager.getDownloadETLLogsButton().should('be.disabled');

    DatasetManager.selectDatasetById(DATASET_ETL.id);
    DatasetManager.getDownloadETLLogsButton().should('be.visible');
    DatasetManager.getDownloadETLLogsButton().should('not.be.disabled');

    const logsAlias = apiUtils.interceptGetETLRunLogs({
      runnerId: ETL_RUNNER_ID,
      runId: ETL_LAST_RUN_ID,
      stubbedLogs: 'ETL run completed successfully.',
    });

    DatasetManager.getDownloadETLLogsButton().click();
    apiUtils.waitAliases([logsAlias], { timeout: 10_000 });
  });
});
