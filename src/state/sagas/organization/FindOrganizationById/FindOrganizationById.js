// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, takeEvery, put, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { OrganizationsUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ACTIONS_KEY } from '../../../commons/OrganizationConstants';

const getUserEmail = (state) => state.auth.userEmail;
const getOrganizationPermissionsMapping = (state) => state.application.permissionsMapping.organization;

export function* fetchOrganizationById(organizationId) {
  const userEmail = yield select(getUserEmail);
  const permissionsMapping = yield select(getOrganizationPermissionsMapping);

  const { data } = yield call(Api.Organizations.findOrganizationById, organizationId);
  OrganizationsUtils.patchOrganizationWithCurrentUserPermissions(data, userEmail, permissionsMapping);

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
