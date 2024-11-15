// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, takeEvery, put, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { STATUSES } from '../../../services/config/StatusConstants';
import { OrganizationsUtils } from '../../../utils';
import { ORGANIZATION_ACTIONS_KEY } from '../constants';
import { setCurrentOrganization } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const getOrganizationPermissionsMapping = (state) => state.application.permissionsMapping.organization;

export function* fetchOrganizationById(organizationId) {
  const userEmail = yield select(getUserEmail);
  const permissionsMapping = yield select(getOrganizationPermissionsMapping);

  const { data } = yield call(Api.Organizations.findOrganizationById, organizationId);
  OrganizationsUtils.patchOrganizationWithCurrentUserPermissions(data, userEmail, permissionsMapping);

  yield put(
    setCurrentOrganization({
      status: STATUSES.SUCCESS,
      organization: data,
    })
  );
}

function* watchGetOrganizationById() {
  yield takeEvery(ORGANIZATION_ACTIONS_KEY.GET_ORGANIZATION_BY_ID, fetchOrganizationById);
}

export default watchGetOrganizationById;
