// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { CurrentScenarioPowerBiReport, CurrentScenarioSupersetReport } from '../../../../components';
import { CHART_MODES } from '../../../../state/charts/constants';
import { useChartMode } from '../../../../state/charts/hooks';
import { useScenarioChartReport } from './ScenarioChartReportHook';

const ScenarioChartReport = () => {
  const { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio, isViewLoading } =
    useScenarioChartReport();

  const chartMode = useChartMode();

  if (chartMode === CHART_MODES.SUPERSET)
    return (
      <CurrentScenarioSupersetReport
        key={currentScenarioData?.id}
        isParentLoading={isViewLoading}
        isInScenarioViewContext
      />
    );

  return (
    <CurrentScenarioPowerBiReport
      // key is used here to assure the complete re-rendering of the component when scenario changes ; we
      // need to remount it to avoid errors in powerbi-client-react which throws an error if filters change
      key={currentScenarioData?.id}
      reportConfiguration={currentScenarioRunTemplateReport}
      iframeRatio={iframeRatio}
      isParentLoading={isViewLoading}
      isInScenarioViewContext
    />
  );
};

export default ScenarioChartReport;
