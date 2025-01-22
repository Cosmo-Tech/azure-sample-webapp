// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentScenarioReportConfig } from '../../../../state/hooks/PowerBIHooks';
import { useCurrentScenarioData } from '../../../../state/hooks/ScenarioHooks';
import { useWorkspaceChartsScenarioViewDisplayIframeRatio } from '../../../../state/hooks/WorkspaceHooks';
import { useBackdropLoadingScenario } from '../BackdropLoadingScenario/BackdropLoadingScenarioHooks';

export const useScenarioPowerBiReport = () => {
  const currentScenarioData = useCurrentScenarioData();
  const currentScenarioRunTemplateReport = useCurrentScenarioReportConfig();
  const iframeRatio = useWorkspaceChartsScenarioViewDisplayIframeRatio();
  const { showBackdrop: isViewLoading } = useBackdropLoadingScenario();
  return { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio, isViewLoading };
};
