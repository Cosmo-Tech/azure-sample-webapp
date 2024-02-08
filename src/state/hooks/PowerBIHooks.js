// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PowerBIUtils } from '../../utils';
import { dispatchSetPowerBIReportsConfig } from '../dispatchers/powerbi/PowerBIDispatcher';
import { useCurrentScenarioData } from './ScenarioHooks';

export const usePowerBIInfo = () => {
  return useSelector((state) => state.powerBI);
};

export const usePowerBIReducerStatus = () => {
  return useSelector((state) => state.powerBI.status);
};

export const usePowerBIReportsConfig = () => {
  return useSelector((state) => state.powerBI?.data?.reportsConfig);
};

export const useDashboardsViewReportsConfig = () => {
  return useSelector((state) => state.powerBI?.data?.reportsConfig?.dashboardsView) ?? [];
};
export const useScenarioViewReportsConfig = () => {
  return useSelector((state) => state.powerBI?.data?.reportsConfig?.scenarioView) ?? [];
};

export const useCurrentScenarioReportConfig = () => {
  const currentScenarioData = useCurrentScenarioData();
  const scenarioViewReportsConfig = useScenarioViewReportsConfig();
  return useMemo(
    () => PowerBIUtils.getScenarioViewReportConfig(scenarioViewReportsConfig, currentScenarioData?.runTemplateId),
    [scenarioViewReportsConfig, currentScenarioData?.runTemplateId]
  );
};

export const usePowerBIReports = () => {
  return useSelector((state) => state.powerBI?.data?.reports);
};

export const useSetPowerBIReportsConfig = (reportsConfig) => {
  const dispatch = useDispatch();
  return useCallback((scenario) => dispatch(dispatchSetPowerBIReportsConfig(scenario)), [dispatch]);
};
