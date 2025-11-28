// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { SolutionSchema } from '../../../services/config/SolutionSchema';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ConfigUtils, SolutionsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
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
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.solutionNotFound',
          'A problem occurred when fetching the solution ' +
            '"{{ solutionId }}". Either this solution does not exist, or you don\'t have access to it.',
          { solutionId }
        ),
      })
    );
    yield put(setCurrentSolution({ status: STATUSES.ERROR, solution: null }));
  }
}

function* findSolutionByIdData() {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
