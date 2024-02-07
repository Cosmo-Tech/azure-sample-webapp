// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Redux Action (equivalent to dispatch function)
import { POWER_BI_ACTIONS_KEY } from '../../commons/PowerBIConstants';

export const dispatchGetPowerBIEmbedInfo = () => ({
  type: POWER_BI_ACTIONS_KEY.GET_EMBED_INFO,
});

export const dispatchSetPowerBIReportsConfig = (reportsConfig) => ({
  type: POWER_BI_ACTIONS_KEY.SET_REPORTS_CONFIG,
  reportsConfig,
});
