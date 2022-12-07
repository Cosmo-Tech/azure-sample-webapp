// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentScenarioData } from '../../../../state/hooks/ScenarioHooks';
import { useCurrentScenarioReportConfig } from '../../../../state/hooks/PowerBIHooks';
import { useWorkspaceChartsScenarioViewDisplayIframeRatio } from '../../../../state/hooks/WorkspaceHooks';

export const useScenarioPowerBiReport = () => {
  const currentScenarioData = useCurrentScenarioData();
  const currentScenarioRunTemplateReport = useCurrentScenarioReportConfig();
  const iframeRatio = useWorkspaceChartsScenarioViewDisplayIframeRatio();
  return { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio };
};
