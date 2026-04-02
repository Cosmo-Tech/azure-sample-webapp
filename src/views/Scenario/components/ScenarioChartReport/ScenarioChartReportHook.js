// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useOverridableCurrentScenarioData } from '../../../../hooks/OverridableScenarioHooks';
import { useCurrentScenarioReportConfig } from '../../../../state/charts/hooks';
import { useWorkspaceChartsScenarioViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';
import { useBackdropLoadingScenario } from '../BackdropLoadingScenario/BackdropLoadingScenarioHooks';

export const useScenarioChartReport = () => {
  const currentScenarioData = useOverridableCurrentScenarioData();
  const currentScenarioRunTemplateReport = useCurrentScenarioReportConfig();
  const iframeRatio = useWorkspaceChartsScenarioViewDisplayIframeRatio();
  const { showBackdrop: isViewLoading } = useBackdropLoadingScenario();
  return { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio, isViewLoading };
};
