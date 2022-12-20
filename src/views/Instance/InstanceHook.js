// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentScenario, useScenarioList, useFindScenarioById } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceId, useWorkspaceInstanceViewConfig } from '../../state/hooks/WorkspaceHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useRedirectionToScenario } from '../../hooks/RouterHooks';

export const useInstance = () => {
  const scenarioList = useScenarioList();
  const currentScenario = useCurrentScenario();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const instanceViewConfig = useWorkspaceInstanceViewConfig();
  const findScenarioById = useFindScenarioById();

  return {
    organizationId,
    workspaceId,
    scenarioList,
    currentScenario,
    findScenarioById,
    useRedirectionToScenario,
    instanceViewConfig,
  };
};
