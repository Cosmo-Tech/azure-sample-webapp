// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PowerBIUtils } from '../../utils';
import { resolveDynamicValue } from '../../utils/ResolveDynamicValue';
import { useCurrentSimulationRunnerData, useRunners } from '../runner/hooks';
import { setPowerBIReportConfig } from './reducers';

export const useChartMode = () => {
  return useSelector((state) => state.charts?.mode);
};

export const usePowerBIInfo = () => {
  return useSelector((state) => state.charts?.powerbi);
};

export const usePowerBIReducerStatus = () => {
  return useSelector((state) => state.charts?.powerbi?.status);
};

export const usePowerBIReportsConfig = () => {
  return useSelector((state) => state.charts?.powerbi?.data?.reportsConfig);
};

export const useDashboardsViewReportsConfig = () => {
  return useSelector((state) => state.charts?.powerbi?.data?.reportsConfig?.dashboardsView) ?? [];
};

export const useScenarioViewReportsConfig = () => {
  return useSelector((state) => state.charts?.powerbi?.data?.reportsConfig?.scenarioView) ?? [];
};

export const useCurrentScenarioReportConfig = () => {
  const currentScenarioData = useCurrentSimulationRunnerData();
  const scenarioViewReportsConfig = useScenarioViewReportsConfig();
  return useMemo(
    () => PowerBIUtils.getScenarioViewReportConfig(scenarioViewReportsConfig, currentScenarioData?.runTemplateId),
    [scenarioViewReportsConfig, currentScenarioData?.runTemplateId]
  );
};

export const usePowerBIUseWebappTheme = () => {
  return useSelector((state) => state.charts?.powerbi?.data?.useWebappTheme ?? false);
};

export const usePowerBIReports = () => {
  return useSelector((state) => state.charts?.powerbi?.data?.reports);
};

export const useSetPowerBIReportsConfig = (reportsConfig) => {
  const dispatch = useDispatch();
  return useCallback((scenario) => dispatch(setPowerBIReportConfig(scenario)), [dispatch]);
};

export const useSupersetInfo = () => {
  return useSelector((state) => state.charts?.superset);
};

export const useSupersetReducerStatus = () => {
  return useSelector((state) => state.charts?.superset?.status);
};

export const useSupersetGuestToken = () => {
  return useSelector((state) => state.charts?.superset?.data?.guestToken);
};

export const useSupersetDashboards = () => {
  return useSelector((state) => state.charts?.superset?.data?.dashboards);
};

export const useSupersetUrl = () => {
  return useSelector((state) => state.charts?.superset?.data?.supersetUrl);
};

export const useCurrentSupersetDashboard = () => {
  const visibleScenarios = useRunners();
  const dashboards = useSupersetDashboards();
  const currentScenarioData = useCurrentSimulationRunnerData();

  return useMemo(() => {
    if (!dashboards?.scenarioView) return null;

    const scenarioView = dashboards.scenarioView;
    const runTemplateId = currentScenarioData?.runTemplateId;

    let dashboardId = scenarioView.default;
    if (scenarioView.overrides?.[runTemplateId]) {
      dashboardId = scenarioView.overrides[runTemplateId];
    }
    if (!dashboardId) return null;

    const fullDashboard = dashboards.dashboards?.find((dashboard) => dashboard.id === dashboardId);

    if (!fullDashboard) return { dashboardId, uiConfig: {} };

    const nativeFilters = [];

    for (const filter of fullDashboard?.filters ?? []) {
      if (typeof filter !== 'object') continue;

      const { id, column, operator, value } = filter;
      if (!id || !column || !operator || !value) {
        console.warn('[Dynamic Filters] Invalid filter configuration detected:', filter);
        continue;
      }

      const dynamicResolved = resolveDynamicValue(value, { currentScenarioData, visibleScenarios });

      const valuesArray = Array.isArray(dynamicResolved) ? dynamicResolved : [dynamicResolved];

      const nativeExpr = valuesArray
        .map(
          (value) =>
            `(NATIVE_FILTER-${id}:` +
            `(__cache:(label:'${value}',validateStatus:!f,value:!('${value}')),` +
            `extraFormData:(filters:!((col:${column},op:${operator},val:!('${value}')))),` +
            `filterState:(label:'${value}',validateStatus:!f,value:!('${value}')),` +
            `id:NATIVE_FILTER-${id},ownState:()))`
        )
        .join(',');

      nativeFilters.push(nativeExpr);
    }

    const nativeFiltersParam = nativeFilters.length > 0 ? nativeFilters.join(',') : undefined;

    return {
      dashboardId: fullDashboard.id,
      height: fullDashboard.height,
      width: fullDashboard.width,
      uiConfig: {
        hideTitle: fullDashboard.hideTitle,
        hideTab: fullDashboard.hideTab,
        hideChartControls: fullDashboard.hideChartControls,
        hideFilters: fullDashboard.hideFilters,
        filters: { expanded: fullDashboard.expandFilters },
        urlParams: nativeFiltersParam ? { native_filters: nativeFiltersParam } : {},
      },
    };
  }, [dashboards, currentScenarioData, visibleScenarios]);
};
