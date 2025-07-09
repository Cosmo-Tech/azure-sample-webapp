// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { POWER_BI_FIELD_ENUM } from '@cosmotech/azure';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { useDashboardsPowerBiReport } from './DashboardsPowerBiReportHook';

const DashboardsPowerBiReport = ({ index }) => {
  const { t } = useTranslation();
  const { reportsConfig, iframeRatio } = useDashboardsPowerBiReport();
  const dynamicFilterValues = reportsConfig[index]?.dynamicFilters?.flatMap((filter) => filter.values);
  const hasFiltersOnSimulationRun = dynamicFilterValues?.some(
    (value) =>
      [POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN, POWER_BI_FIELD_ENUM.LAST_RUN_ID].includes(value) ?? false
  );

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
