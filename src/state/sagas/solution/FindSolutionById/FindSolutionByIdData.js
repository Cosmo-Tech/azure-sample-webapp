// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SolutionSchema } from '../../../../services/config/SolutionSchema';
import { ConfigUtils, SolutionsUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* fetchSolutionByIdData(organizationId, solutionId) {
  try {
    const { data } = yield call(Api.Solutions.findSolutionById, organizationId, solutionId);
    SolutionsUtils.castMinMaxDefaultValuesInSolution(data);
    SolutionsUtils.patchSolutionIfLocalConfigExists(data);
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, data);
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
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.', "You don't have permission to access this solution.")
      )
    );
    yield put({
      type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION,
      status: STATUSES.ERROR,
      solution: null,
    });
  }
}

function* findSolutionByIdData() {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
