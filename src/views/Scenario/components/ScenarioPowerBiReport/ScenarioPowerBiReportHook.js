// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentScenarioReportConfig } from '../../../../state/powerBi/hooks';
import { useCurrentSimulationRunnerData } from '../../../../state/runner/hooks';
import { useWorkspaceChartsScenarioViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';
import { useBackdropLoadingScenario } from '../BackdropLoadingScenario/BackdropLoadingScenarioHooks';

export const useScenarioPowerBiReport = () => {
  const currentScenarioData = useCurrentSimulationRunnerData();
  const currentScenarioRunTemplateReport = useCurrentScenarioReportConfig();
  const iframeRatio = useWorkspaceChartsScenarioViewDisplayIframeRatio();
  const { showBackdrop: isViewLoading } = useBackdropLoadingScenario();
  return { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio, isViewLoading };
};
