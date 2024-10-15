// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useRedirectionToScenario, useRedirectFromDisabledView } from '../../hooks/RouterHooks';
import { useDatasets } from '../../state/datasets/hooks';
import { useOrganizationId } from '../../state/organizations/hooks';
import { useCurrentSimulationRunner } from '../../state/runner/hooks';
import { useWorkspaceId, useWorkspaceInstanceViewConfig } from '../../state/workspaces/hooks';

export const useInstance = () => {
  const currentScenario = useCurrentSimulationRunner();
  const datasets = useDatasets();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const instanceViewConfig = useWorkspaceInstanceViewConfig();

  return {
    datasets,
    organizationId,
    workspaceId,
    currentScenario,
    useRedirectFromDisabledView,
    useRedirectionToScenario,
    instanceViewConfig,
  };
};
