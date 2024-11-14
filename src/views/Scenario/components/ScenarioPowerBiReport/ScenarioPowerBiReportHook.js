// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentScenarioReportConfig } from '../../../../state/powerBi/hooks';
import { useCurrentSimulationRunnerData } from '../../../../state/runner/hooks';
import { useWorkspaceChartsScenarioViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';

export const useScenarioPowerBiReport = () => {
  const currentScenarioData = useCurrentSimulationRunnerData();
  const currentScenarioRunTemplateReport = useCurrentScenarioReportConfig();
  const iframeRatio = useWorkspaceChartsScenarioViewDisplayIframeRatio();
  return { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio };
};
