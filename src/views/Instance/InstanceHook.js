// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentScenario, useScenarioList, useFindScenarioById } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { useRedirectionToScenario } from '../../hooks/RouterHooks';

export const useInstance = () => {
  const scenarioList = useScenarioList();
  const currentScenario = useCurrentScenario();
  const workspaceId = useWorkspaceId();
  const findScenarioById = useFindScenarioById();

  return [workspaceId, scenarioList, currentScenario, findScenarioById, useRedirectionToScenario];
};
