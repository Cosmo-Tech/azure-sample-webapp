// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POWER_BI_FIELD_ENUM } from '@cosmotech/azure';
import { STATUSES } from '../../services/config/StatusConstants';
import { PowerBIUtils } from '../../utils';
import { forgeReport } from '../../utils/SupersetUtils';
import { useCurrentSimulationRunnerData, useRunners } from '../runner/hooks';
import { dispatchStopChartsTokenPolling } from './dispatchers';
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

export const useGetSupersetReportWithScenarioContext = () => {
  const visibleScenarios = useRunners();
  const dashboardsConfig = useSupersetDashboards();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const reducerStatus = useSupersetReducerStatus();

  // Parameters:
  //  - selectedDashboardIndexInDashboardView (int): undefined when using component in Scenario view, otherwise it
  //    represents the index of the selected dashboard when using component in Dashboards view
  return useCallback(
    (selectedDashboardIndexInDashboardView) => {
      if (reducerStatus === STATUSES.DISABLED) return {};

      let dashboardId;
      if (selectedDashboardIndexInDashboardView == null) {
        if (!dashboardsConfig?.scenarioView) {
          console.warn(`No superset dashboards configured for scenario view`);
          return { noDashboardConfiguredForRunTemplate: true };
        }

        const scenarioViewDashboards = dashboardsConfig.scenarioView;
        const runTemplateId = currentScenarioData?.runTemplateId;
        dashboardId = scenarioViewDashboards.overrides?.[runTemplateId] ?? scenarioViewDashboards.default;
        if (!dashboardId) {
          console.warn(`No superset dashboard configured for run template "${runTemplateId}"`);
          return { noDashboardConfiguredForRunTemplate: true };
        }
      } else {
        if (!dashboardsConfig?.dashboardView) {
          console.warn('No superset dashboards configured for dashboards view');
          return {};
        }

        dashboardId = dashboardsConfig.dashboardView[selectedDashboardIndexInDashboardView]?.id;
        if (!dashboardId) {
          console.warn(`No entry found in Dashbaords view list at index "${selectedDashboardIndexInDashboardView}"`);
          return {};
        }
      }

      const dashboard = dashboardsConfig.dashboards?.find((dashboard) => dashboard.id === dashboardId);
      if (!dashboard) {
        console.warn(
          `No entry found in superset dashboards list with id "${dashboardId}".` +
            'Plaese make sure that your dashboard is defined in your workspace configuration ' +
            'additionalData.webapp.charts.dashboards)'
        );
        return {};
      }

      const filterValues = (dashboard?.filters ?? []).map((filter) => filter.value);
      const hasFiltersOnLastRunId = filterValues.includes(POWER_BI_FIELD_ENUM.LAST_RUN_ID);
      const alwaysShowReports = !hasFiltersOnLastRunId;

      return {
        noDashboardConfiguredForRunTemplate: false,
        report: forgeReport(dashboard, visibleScenarios, currentScenarioData),
        alwaysShowReports,
      };
    },
    [dashboardsConfig, currentScenarioData, visibleScenarios, reducerStatus]
  );
};

export const useStopChartsTokenPolling = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchStopChartsTokenPolling()), [dispatch]);
};
