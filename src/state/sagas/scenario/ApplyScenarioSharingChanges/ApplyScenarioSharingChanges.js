// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.
import { t } from 'i18next';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { DATASET_ID_VARTYPE } from '../../../../services/config/ApiConstants';
import DatasetService from '../../../../services/dataset/DatasetService';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { SecurityUtils } from '../../../../utils';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;
const getOrganizationId = (state) => state.organization.current.data.id;
const getWorkspaceId = (state) => state.workspace.current.data.id;
const getCurrentScenario = (state) => state.scenario.current?.data;
const getDatasets = (state) => state.dataset.list?.data;
const getSolutionParameters = (state) => state?.solution?.current?.data?.parameters ?? [];
const getDatasetPermissionMapping = (state) => state.application.permissionsMapping.dataset;

export function* applyScenarioSharingChanges(action) {
  try {
    const organizationId = yield select(getOrganizationId);
    const workspaceId = yield select(getWorkspaceId);
    const datasets = yield select(getDatasets);
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    const currentScenario = yield select(getCurrentScenario);
    const currentScenarioSecurity = currentScenario?.security;
    const { scenarioId, newScenarioSecurity } = action;

    const mustUpdateSecurity = yield call(
      ScenarioService.updateSecurity,
      organizationId,
      workspaceId,
      scenarioId,
      currentScenarioSecurity,
      newScenarioSecurity
    );

    const solutionParameters = yield select(getSolutionParameters);
    const defaultDatasetsIds = solutionParameters
      .filter((parameter) => parameter.varType === DATASET_ID_VARTYPE && parameter.defaultValue != null)
      .map((parameter) => parameter.defaultValue);

    const scenarioDatasetsIds = (currentScenario.parametersValues ?? [])
      .filter((value) => value.varType === DATASET_ID_VARTYPE)
      .map((dataset) => dataset.value);
    for (const datasetId of scenarioDatasetsIds) {
      if (defaultDatasetsIds.includes(datasetId)) continue; // Do not update access to common "default datasets"

      const dataset = datasets.find((el) => el.id === datasetId);
      if (!dataset) {
        console.warn(`Unable to find dataset part ${datasetId}, you may lack "read" permission on this dataset.`);
        continue;
      }

      const newDatasetSecurity = SecurityUtils.forgeDatasetSecurityFromScenarioSecurity(newScenarioSecurity);
      yield call(DatasetService.updateSecurity, organizationId, datasetId, dataset.security, newDatasetSecurity);

      const datasetPermissionsMapping = yield select(getDatasetPermissionMapping);
      yield put({
        type: DATASET_ACTIONS_KEY.SET_DATASET_SECURITY,
        datasetId,
        security: newDatasetSecurity,
        userEmail,
        userId,
        datasetPermissionsMapping,
      });
    }

    if (mustUpdateSecurity) {
      const scenariosPermissionsMapping = yield select(getScenariosPermissionsMapping);
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_SECURITY,
        scenarioId,
        security: newScenarioSecurity,
        userEmail,
        userId,
        scenariosPermissionsMapping,
      });
    }
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.updatePermissions', 'Some scenario permissions have not been updated correctly.')
      )
    );
  }
}

function* applyScenarioSharingChangesSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_SCENARIO_SECURITY, applyScenarioSharingChanges);
}

export default applyScenarioSharingChangesSaga;
