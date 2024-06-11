// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useRedirectFromInstanceToScenarioView, useRedirectionToScenario } from '../../hooks/RouterHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useCurrentScenario } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceId, useWorkspaceInstanceViewConfig } from '../../state/hooks/WorkspaceHooks';

export const useInstance = () => {
  const currentScenario = useCurrentScenario();
  const datasets = useDatasets();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const instanceViewConfig = useWorkspaceInstanceViewConfig();

  return {
    datasets,
    organizationId,
    workspaceId,
    currentScenario,
    useRedirectFromInstanceToScenarioView,
    useRedirectionToScenario,
    instanceViewConfig,
  };
};
