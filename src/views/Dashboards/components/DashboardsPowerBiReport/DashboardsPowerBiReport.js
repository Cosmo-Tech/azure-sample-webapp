// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { CurrentScenarioPowerBiReport } from '../../../../components';
import { DASHBOARDS_LIST_CONFIG, DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO } from '../../../../config/PowerBI';
const DashboardsPowerBiReport = ({ index }) => {
  return (
    <CurrentScenarioPowerBiReport
      index={index}
      reportConfiguration={DASHBOARDS_LIST_CONFIG}
      iframeRatio={DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO}
    />
  );
};

DashboardsPowerBiReport.propTypes = {
  index: PropTypes.any.isRequired,
};

export default DashboardsPowerBiReport;
