// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { STATUSES } from '../../../commons/Constants';
import { Api } from '../../../../services/config/Api';
import { ConfigUtils, SolutionsUtils } from '../../../../utils';

export function* fetchSolutionByIdData(organizationId, workspaceId, solutionId) {
  const { data } = yield call(Api.Solutions.findSolutionById, organizationId, solutionId);
  SolutionsUtils.castMinMaxDefaultValuesInSolution(data);
  SolutionsUtils.patchSolutionIfLocalConfigExists(data);
  SolutionsUtils.checkParametersValidationConstraintsInSolution(data);
  ConfigUtils.checkDeprecatedKeysInConfig(data);
  SolutionsUtils.patchIncompatibleValuesInSolution(data);

  SolutionsUtils.addRunTemplatesParametersIdsDict(data);
  SolutionsUtils.addTranslationLabels(data);

  yield put({
    type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION,
    status: STATUSES.SUCCESS,
    solution: data,
  });
}

function* findSolutionByIdData() {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
