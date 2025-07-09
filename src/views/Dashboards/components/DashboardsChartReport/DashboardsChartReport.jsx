// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { POWER_BI_FIELD_ENUM } from '@cosmotech/azure';
import { CurrentScenarioPowerBiReport, CurrentScenarioSupersetReport } from '../../../../components';
import { CHART_MODES } from '../../../../state/charts/constants';
import { useChartMode } from '../../../../state/charts/hooks';
import { useDashboardsChartReport } from './DashboardsChartReportHook';

const DashboardsChartReport = ({ index }) => {
  const { t } = useTranslation();
  const { reportsConfig, iframeRatio } = useDashboardsChartReport();
  const chartMode = useChartMode();

  const dynamicFilterValues = reportsConfig[index]?.dynamicFilters?.flatMap((filter) => filter.values);
  const hasFiltersOnSimulationRun =
    dynamicFilterValues?.some((value) => value === POWER_BI_FIELD_ENUM.LAST_RUN_ID) ?? false;

  const dashboardsViewSpecificLabels = {
    noScenario: {
      title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
      label: t(
        'commoncomponents.iframe.scenario.noscenario.dashboardsViewLabel',
        'You can create scenarios in the Scenario view'
      ),
    },
  };

  if (chartMode === CHART_MODES.SUPERSET) {
    return (
      <CurrentScenarioSupersetReport
        index={index}
        reportConfiguration={reportsConfig}
        labels={dashboardsViewSpecificLabels}
        alwaysShowReports={true}
      />
    );
  }
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

DashboardsChartReport.propTypes = {
  index: PropTypes.any.isRequired,
};

export default DashboardsChartReport;
