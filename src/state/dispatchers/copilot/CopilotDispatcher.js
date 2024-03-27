// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { COPILOT_ACTIONS_KEY } from '../../commons/CopilotConstants';

export const dispatchGetToken = (payLoad) => ({
  type: COPILOT_ACTIONS_KEY.GET_COPILOT_TOKEN,
  ...payLoad,
});
