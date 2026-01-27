// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CurrentScenarioPowerBiReport, CurrentScenarioSupersetReport } from '../../../../components';
import { CHART_MODES } from '../../../../state/charts/constants';
import { useChartMode } from '../../../../state/charts/hooks';
import { useDashboardsChartReport } from './DashboardsChartReportHook';

const DashboardsChartReport = ({ index, reports }) => {
  const { t } = useTranslation();
  const { iframeRatio } = useDashboardsChartReport();
  const chartMode = useChartMode();

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
    return <CurrentScenarioSupersetReport index={index} labels={dashboardsViewSpecificLabels} />;
  }
  return (
    <CurrentScenarioPowerBiReport
      index={index}
      reportConfiguration={reports}
      iframeRatio={iframeRatio}
      labels={dashboardsViewSpecificLabels}
    />
  );
};

DashboardsChartReport.propTypes = {
  index: PropTypes.any.isRequired,
  reports: PropTypes.object.isRequired,
};

export default DashboardsChartReport;
