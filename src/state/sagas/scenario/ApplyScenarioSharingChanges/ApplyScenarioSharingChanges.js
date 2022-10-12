// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.

import { takeEvery, select, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { Api } from '../../../../services/config/Api';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { SecurityUtils } from '../../../../utils';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;
const getWorkspaceId = (state) => state.workspace.current.data.id;
const getCurrentScenarioSecurity = (state) => state.scenario.current?.data?.security;

export function* applyScenarioSharingChanges(action) {
  try {
    const workspaceId = yield select(getWorkspaceId);
    const currentScenarioSecurity = yield select(getCurrentScenarioSecurity);
    const { scenarioId, newScenarioSecurity } = action;
    let mustUpdateSecurity = false;

    if (currentScenarioSecurity.default !== newScenarioSecurity.default) {
      mustUpdateSecurity = true;
      yield call(Api.Scenarios.setScenarioDefaultSecurity, ORGANIZATION_ID, workspaceId, scenarioId, {
        role: newScenarioSecurity.default,
      });
    }

    if (
      !SecurityUtils.areAccessControlListsIdentical(
        currentScenarioSecurity.accessControlList,
        newScenarioSecurity.accessControlList
      )
    ) {
      mustUpdateSecurity = true;
      // Compute diff
      const { usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(
        currentScenarioSecurity.accessControlList,
        newScenarioSecurity.accessControlList
      );
      // Remove entries that have been deleted
      const usersIdsToRemove = SecurityUtils.getUsersIdsFromACL(usersToRemove);
      for (const userIdToRemove of usersIdsToRemove) {
        yield call(Api.Scenarios.removeScenarioAccessControl, ORGANIZATION_ID, workspaceId, scenarioId, userIdToRemove);
      }
      // Add new entries or existing entries whose role have changed
      const newAccesses = usersToAdd.concat(usersToModify);
      for (const userToAdd of newAccesses) {
        yield call(Api.Scenarios.addScenarioAccessControl, ORGANIZATION_ID, workspaceId, scenarioId, userToAdd);
      }
    }

    if (mustUpdateSecurity) {
      const userEmail = yield select(getUserEmail);
      const userId = yield select(getUserId);
      const scenariosPermissionsMapping = yield select(getScenariosPermissionsMapping);
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_SECURITY,
        scenarioId: scenarioId,
        security: newScenarioSecurity,
        userEmail: userEmail,
        userId: userId,
        scenariosPermissionsMapping: scenariosPermissionsMapping,
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
