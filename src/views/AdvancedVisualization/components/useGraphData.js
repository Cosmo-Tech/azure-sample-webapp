import { useDatasets } from '../../../state/hooks/DatasetHooks';
import { useOrganizationId } from '../../../state/hooks/OrganizationHooks';
import { useCurrentScenario } from '../../../state/hooks/ScenarioHooks';
import { useWorkspaceId, useWorkspaceInstanceViewConfig } from '../../../state/hooks/WorkspaceHooks';

export const useGraphData = () => {
  const currentScenario = useCurrentScenario();
  const datasets = useDatasets();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const instanceViewConfig = useWorkspaceInstanceViewConfig();

  return {
    datasets,
    organizationId,
    workspaceId,
    scenario: currentScenario.data,
    instanceViewConfig,
  };
};
