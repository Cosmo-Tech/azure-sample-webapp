// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.

import { takeEvery, select, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import ScenarioService from '../../../../services/scenario/ScenarioService';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;
const getOrganizationId = (state) => state.organization.current.data.id;
const getWorkspaceId = (state) => state.workspace.current.data.id;
const getCurrentScenarioSecurity = (state) => state.scenario.current?.data?.security;

export function* applyScenarioSharingChanges(action) {
  try {
    const organizationId = yield select(getOrganizationId);
    const workspaceId = yield select(getWorkspaceId);
    const currentScenarioSecurity = yield select(getCurrentScenarioSecurity);
    const { scenarioId, newScenarioSecurity } = action;

    const mustUpdateSecurity = yield call(
      ScenarioService.updateSecurity,
      organizationId,
      workspaceId,
      scenarioId,
      currentScenarioSecurity,
      newScenarioSecurity
    );

    if (mustUpdateSecurity) {
      const userEmail = yield select(getUserEmail);
      const userId = yield select(getUserId);
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
  yield takeEvery(SCENARIO_ACTIONS_KEY.APPLY_SCENARIO_SHARING_CHANGES, applyScenarioSharingChanges);
}

export default applyScenarioSharingChangesSaga;
