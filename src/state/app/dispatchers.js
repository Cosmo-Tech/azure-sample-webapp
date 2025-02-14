// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { STATUSES } from '../../services/config/StatusConstants';
import { APPLICATION_ACTIONS_KEY } from './constants';

export const dispatchGetAllInitialData = (payload) => ({
  type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA,
  status: STATUSES.LOADING,
});
