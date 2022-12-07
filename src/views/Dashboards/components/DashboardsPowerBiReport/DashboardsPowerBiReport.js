// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { useDashboardsPowerBiReport } from './DashboardsPowerBiReportHook';

const DashboardsPowerBiReport = ({ index }) => {
  const { reportsConfig, iframeRatio } = useDashboardsPowerBiReport();
  return <CurrentScenarioPowerBiReport index={index} reportConfiguration={reportsConfig} iframeRatio={iframeRatio} />;
};

DashboardsPowerBiReport.propTypes = {
  index: PropTypes.any.isRequired,
};

export default DashboardsPowerBiReport;
