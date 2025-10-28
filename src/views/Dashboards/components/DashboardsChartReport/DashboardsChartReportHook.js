// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDashboardsViewReportsConfig } from '../../../../state/charts/hooks';
import { useWorkspaceChartsDashboardsViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';

export const useDashboardsChartReport = () => {
  const reportsConfig = useDashboardsViewReportsConfig();
  const iframeRatio = useWorkspaceChartsDashboardsViewDisplayIframeRatio();
  return { reportsConfig, iframeRatio };
};
