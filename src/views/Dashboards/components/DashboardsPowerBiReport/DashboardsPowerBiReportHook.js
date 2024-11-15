// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDashboardsViewReportsConfig } from '../../../../state/powerBi/hooks';
import { useWorkspaceChartsDashboardsViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';

export const useDashboardsPowerBiReport = () => {
  const reportsConfig = useDashboardsViewReportsConfig();
  const iframeRatio = useWorkspaceChartsDashboardsViewDisplayIframeRatio();
  return { reportsConfig, iframeRatio };
};
