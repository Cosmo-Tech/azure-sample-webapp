// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDashboardsViewReportsConfig } from '../../../../state/hooks/PowerBIHooks';
import { useWorkspaceChartsDashboardsViewDisplayIframeRatio } from '../../../../state/hooks/WorkspaceHooks';

export const useDashboardsPowerBiReport = () => {
  const reportsConfig = useDashboardsViewReportsConfig();
  const iframeRatio = useWorkspaceChartsDashboardsViewDisplayIframeRatio();
  return { reportsConfig, iframeRatio };
};
