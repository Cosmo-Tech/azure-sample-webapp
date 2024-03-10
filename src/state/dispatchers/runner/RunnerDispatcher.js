// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RUNNER_ACTIONS_KEY } from '../../commons/RunnerConstants';

export const dispatchCreateRunner = (organizationId, workspaceId, runner) => ({
  type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_RUNNER,
  organizationId,
  workspaceId,
  runner,
});
