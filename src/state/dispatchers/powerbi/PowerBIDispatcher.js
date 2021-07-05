// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { POWER_BI_ACTIONS_KEY } from '../../commons/PowerBIConstants';

export const dispatchGetPowerBIEmbedInfo = () => ({
  type: POWER_BI_ACTIONS_KEY.GET_EMBED_INFO
});
