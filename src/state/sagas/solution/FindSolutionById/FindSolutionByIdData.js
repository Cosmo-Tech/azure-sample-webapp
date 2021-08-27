// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';
import { ConfigUtils, SolutionsUtils } from '../../../../utils';
import { SCENARIO_PARAMETERS_CONFIG } from '../../../../config/ScenarioParameters';

export function * fetchSolutionByIdData (workspaceId, solutionId) {
  try {
    const { data } = yield call(Api.Solutions.findSolutionById, ORGANIZATION_ID, solutionId);
    SolutionsUtils.addRunTemplatesParametersIdsDict(data, SCENARIO_PARAMETERS_CONFIG);
    SolutionsUtils.addTranslationLabels(data);
    // Overwrite solution labels by local config
    ConfigUtils.addTranslationLabels(SCENARIO_PARAMETERS_CONFIG);
    yield put({
      type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION,
      status: STATUSES.SUCCESS,
      solution: data
    });
  } catch (e) {
    console.error(e);
  }
}

function * findSolutionByIdData () {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
