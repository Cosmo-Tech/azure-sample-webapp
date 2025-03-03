// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.
import { t } from 'i18next';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';
import DatasetService from '../../../services/dataset/DatasetService';
import RunnerService from '../../../services/runner/RunnerService';
import { SecurityUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { setDatasetSecurity } from '../../datasets/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { setRunnerSecurity } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getRunnersPermissionsMapping = (state) => state.application.permissionsMapping.runner;
const getOrganizationId = (state) => state.organization.current.data.id;
const getWorkspaceId = (state) => state.workspace.current.data.id;
const getCurrentSimulationRunner = (state) => state.runner.simulationRunners.current?.data;
const getDatasets = (state) => state.dataset.list?.data;
const getSolutionParameters = (state) => state?.solution?.current?.data?.parameters ?? [];
const getDatasetPermissionMapping = (state) => state.application.permissionsMapping.dataset;

export function* applyRunnerSharingChanges(action) {
  try {
    const organizationId = yield select(getOrganizationId);
    const workspaceId = yield select(getWorkspaceId);
    const datasets = yield select(getDatasets);
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    const currentSimulationRunner = yield select(getCurrentSimulationRunner);
    const currentSimulationRunnerSecurity = currentSimulationRunner?.security;
    const { runnerId, newRunnerSecurity } = action;

    const mustUpdateSecurity = yield call(
      RunnerService.updateSecurity,
      organizationId,
      workspaceId,
      runnerId,
      currentSimulationRunnerSecurity,
      newRunnerSecurity
    );

    const solutionParameters = yield select(getSolutionParameters);
    const defaultDatasetsIds = solutionParameters
      .filter((parameter) => parameter.varType === DATASET_ID_VARTYPE && parameter.defaultValue != null)
      .map((parameter) => parameter.defaultValue);

    const runnerDatasetsIds = (currentSimulationRunner.parametersValues ?? [])
      .filter((value) => value.varType === DATASET_ID_VARTYPE)
      .map((dataset) => dataset.value);
    for (const datasetId of runnerDatasetsIds) {
      if (defaultDatasetsIds.includes(datasetId)) continue; // Do not update access to common "default datasets"

      const dataset = datasets.find((el) => el.id === datasetId);
      if (!dataset) {
        console.warn(`Unable to find dataset part ${datasetId}, you may lack "read" permission on this dataset.`);
        continue;
      }

      const newDatasetSecurity = SecurityUtils.forgeDatasetSecurityFromRunnerSecurity(newRunnerSecurity);
      yield call(DatasetService.updateSecurity, organizationId, datasetId, dataset.security, newDatasetSecurity);

      const datasetPermissionsMapping = yield select(getDatasetPermissionMapping);
      yield put(
        setDatasetSecurity({
          datasetId,
          security: newDatasetSecurity,
          userEmail,
          userId,
          datasetPermissionsMapping,
        })
      );
    }

    if (mustUpdateSecurity) {
      const runnersPermissionsMapping = yield select(getRunnersPermissionsMapping);
      yield put(
        setRunnerSecurity({
          runnerId,
          security: newRunnerSecurity,
          userEmail,
          userId,
          runnersPermissionsMapping,
        })
      );
    }
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.updatePermissions',
          'Some scenario permissions have not been updated correctly.'
        ),
      })
    );
  }
}

function* applyRunnerSharingChangesSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.UPDATE_RUNNER_SECURITY, applyRunnerSharingChanges);
}

export default applyRunnerSharingChangesSaga;
