// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { RUN_TEMPLATE_ACTIONS_KEY } from '../../commons/RunTemplateConstants';

export const dispatchSetRunTemplateList = (payLoad) => ({
  type: RUN_TEMPLATE_ACTIONS_KEY.SET_RUN_TEMPLATE_LIST,
  ...payLoad
});
