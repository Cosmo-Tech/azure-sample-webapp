// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { useDashboardsPowerBiReport } from './DashboardsPowerBiReportHook';

const DashboardsPowerBiReport = ({ index }) => {
  const { t } = useTranslation();
  const { reportsConfig, iframeRatio } = useDashboardsPowerBiReport();
  const hasFiltersOnSimulationRun = reportsConfig[index]?.dynamicFilters
    ?.flatMap((filter) => filter.values)
    .includes('csmSimulationRun');

  const dashboardsViewSpecificLabels = {
    noScenario: {
      title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
      label: t(
        'commoncomponents.iframe.scenario.noscenario.dashboardsViewLabel',
        'You can create scenarios in the Scenario view'
      ),
    },
  };
  return (
    <CurrentScenarioPowerBiReport
      index={index}
      reportConfiguration={reportsConfig}
      iframeRatio={iframeRatio}
      labels={dashboardsViewSpecificLabels}
      alwaysShowReports={!hasFiltersOnSimulationRun}
    />
  );
};

DashboardsPowerBiReport.propTypes = {
  index: PropTypes.any.isRequired,
};

export default DashboardsPowerBiReport;
