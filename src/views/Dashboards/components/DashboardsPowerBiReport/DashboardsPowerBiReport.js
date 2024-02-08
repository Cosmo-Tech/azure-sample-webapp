// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { useDashboardsPowerBiReport } from './DashboardsPowerBiReportHook';

const DashboardsPowerBiReport = ({ index }) => {
  const { reportsConfig, iframeRatio } = useDashboardsPowerBiReport();
  const hasFiltersOnSimulationRun = reportsConfig[index]?.dynamicFilters
    ?.flatMap((filter) => filter.values)
    .includes('csmSimulationRun');
  return (
    <CurrentScenarioPowerBiReport
      index={index}
      reportConfiguration={reportsConfig}
      iframeRatio={iframeRatio}
      alwaysShowReports={!hasFiltersOnSimulationRun}
    />
  );
};

DashboardsPowerBiReport.propTypes = {
  index: PropTypes.any.isRequired,
};

export default DashboardsPowerBiReport;
