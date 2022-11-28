// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, takeEvery, put } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ACTIONS_KEY } from '../../../commons/OrganizationConstants';
import { Api } from '../../../../services/config/Api';

export function* fetchOrganizationById(organizationId) {
  const { data } = yield call(Api.Organizations.findOrganizationById, organizationId);
  yield put({
    type: ORGANIZATION_ACTIONS_KEY.SET_CURRENT_ORGANIZATION,
    status: STATUSES.SUCCESS,
    organization: data,
  });
}

function* watchGetOrganizationById() {
  yield takeEvery(ORGANIZATION_ACTIONS_KEY.GET_ORGANIZATION_BY_ID, fetchOrganizationById);
}

export default watchGetOrganizationById;
