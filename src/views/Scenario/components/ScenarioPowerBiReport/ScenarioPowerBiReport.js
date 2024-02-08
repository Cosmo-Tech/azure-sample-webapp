// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { useScenarioPowerBiReport } from './ScenarioPowerBiReportHook';

const ScenarioPowerBiReport = () => {
  const { currentScenarioData, currentScenarioRunTemplateReport, iframeRatio } = useScenarioPowerBiReport();

  return (
    <CurrentScenarioPowerBiReport
      // key is used here to assure the complete re-rendering of the component when scenario changes ; we
      // need to remount it to avoid errors in powerbi-client-react which throws an error if filters change
      key={currentScenarioData?.id}
      reportConfiguration={currentScenarioRunTemplateReport}
      iframeRatio={iframeRatio}
    />
  );
};

export default ScenarioPowerBiReport;
