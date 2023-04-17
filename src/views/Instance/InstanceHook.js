// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentScenario } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceId, useWorkspaceInstanceViewConfig } from '../../state/hooks/WorkspaceHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useRedirectFromInstanceToScenarioView, useRedirectionToScenario } from '../../hooks/RouterHooks';

export const useInstance = () => {
  const currentScenario = useCurrentScenario();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const instanceViewConfig = useWorkspaceInstanceViewConfig();

  return {
    organizationId,
    workspaceId,
    currentScenario,
    useRedirectFromInstanceToScenarioView,
    useRedirectionToScenario,
    instanceViewConfig,
  };
};
