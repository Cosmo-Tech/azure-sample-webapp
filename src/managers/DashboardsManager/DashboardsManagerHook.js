// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSetPowerBIReportsConfig } from '../../state/powerBi/hooks';
import { useWorkspaceCharts } from '../../state/workspaces/hooks';
import { PowerBIUtils } from '../../utils';

export const useDashboardsManager = () => {
  const dispatch = useDispatch();
  const setPowerBIReportsConfig = useSetPowerBIReportsConfig();
  const workspaceCharts = useWorkspaceCharts();

  useEffect(() => {
    const filledWorkspaceChartsConfig = PowerBIUtils.fillChartsConfig(workspaceCharts);
    dispatch(setPowerBIReportsConfig(filledWorkspaceChartsConfig));
  }, [workspaceCharts, dispatch, setPowerBIReportsConfig]);

  return {};
};
