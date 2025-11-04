// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PowerBIUtils } from '../../utils';
import { useCurrentSimulationRunnerData } from '../runner/hooks';
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

export const usePowerBIError = () => {
  return useSelector((state) => state.charts?.powerbi?.error);
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

export const useSupersetError = () => {
  return useSelector((state) => state.charts?.superset?.error);
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
  const currentScenarioData = useCurrentSimulationRunnerData();
  const dashboards = useSupersetDashboards();

  return useMemo(() => {
    if (!dashboards?.scenarioView) {
      return null;
    }

    const scenarioView = dashboards.scenarioView;
    const runTemplateId = currentScenarioData?.runTemplateId;

    let dashboardId = scenarioView.default;

    if (scenarioView.overrides?.[runTemplateId]) {
      dashboardId = scenarioView.overrides[runTemplateId];
    }

    if (!dashboardId) {
      return null;
    }

    const fullDashboard = dashboards.dashboards?.find((dashboard) => dashboard.id === dashboardId);

    if (fullDashboard) {
      return {
        dashboardId: fullDashboard.id,
        uiConfig: {
          hideTitle: fullDashboard.hideTitle,
          hideTab: fullDashboard.hideTab,
          hideChartControls: fullDashboard.hideChartControls,
        },
      };
    }

    return {
      dashboardId,
      uiConfig: {},
    };
  }, [dashboards, currentScenarioData?.runTemplateId]);
};
