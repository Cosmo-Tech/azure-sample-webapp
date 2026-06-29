// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { SolutionSchema } from '../../../services/config/SolutionSchema';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ConfigUtils, SolutionsUtils } from '../../../utils';
import { SOLUTION_ACTIONS_KEY } from '../constants';
import { setCurrentSolution } from '../reducers';

export function* fetchSolutionByIdData(organizationId, solutionId) {
  try {
    const { data } = yield call(Api.Solutions.getSolution, organizationId, solutionId);
    SolutionsUtils.patchSolutionIfLocalConfigExists(data);
    SolutionsUtils.castMinMaxDefaultValuesInSolution(data);
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, data);
    SolutionsUtils.checkParametersValidationConstraintsInSolution(data);
    ConfigUtils.checkDeprecatedKeysInConfig(data);
    SolutionsUtils.patchIncompatibleValuesInSolution(data);

    SolutionsUtils.addRunTemplatesParametersIdsDict(data);
    SolutionsUtils.addTranslationLabels(data);

    yield put(setCurrentSolution({ status: STATUSES.SUCCESS, solution: data }));
  } catch (error) {
    yield put(setCurrentSolution({ status: STATUSES.ERROR, solution: null }));
    throw error;
  }
}

function* findSolutionByIdData() {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
