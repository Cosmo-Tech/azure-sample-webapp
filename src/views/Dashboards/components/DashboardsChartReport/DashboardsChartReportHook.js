// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useWorkspaceChartsDashboardsViewDisplayIframeRatio } from '../../../../state/workspaces/hooks';

export const useDashboardsChartReport = () => {
  const iframeRatio = useWorkspaceChartsDashboardsViewDisplayIframeRatio();
  return { iframeRatio };
};
