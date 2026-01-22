// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { CHART_MODES } from '../../state/charts/constants';
import { useChartMode, useDashboardsViewReportsConfig, useSupersetDashboards } from '../../state/charts/hooks';

export const DEFAULT_MISSING_TITLE = 'MISSING_TITLE_IN_LANGUAGE';

export const useDashboards = () => {
  const chartType = useChartMode();
  const powerBIReports = useDashboardsViewReportsConfig();
  const supersetDashboards = useSupersetDashboards();

  const reports = useMemo(() => {
    if (chartType === CHART_MODES.POWERBI) return powerBIReports;
    if (chartType === CHART_MODES.SUPERSET) return supersetDashboards?.dashboardView ?? [];
    return [];
  }, [chartType, powerBIReports, supersetDashboards]);

  const getTitleFromReport = useCallback((report, lang) => {
    return report?.title?.[lang] ?? report?.id ?? report?.reportId ?? DEFAULT_MISSING_TITLE;
  }, []);

  return { reports, getTitleFromReport };
};
