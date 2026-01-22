// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { CHART_ACTIONS_KEY } from './constants';

export const dispatchGetPowerBIEmbedInfo = () => ({
  type: CHART_ACTIONS_KEY.GET_EMBED_INFO,
});

export const dispatchGetSupersetGuestToken = () => ({
  type: CHART_ACTIONS_KEY.GET_SUPERSET_GUEST_TOKEN,
});

export const dispatchStopChartsTokenPolling = () => ({
  type: CHART_ACTIONS_KEY.STOP_CHARTS_TOKEN_POLLING,
});
