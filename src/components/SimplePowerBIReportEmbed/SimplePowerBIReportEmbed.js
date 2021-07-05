// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useMemo, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import * as PropTypes from 'prop-types';
import { PowerBIUtils } from './PowerBIUtils';

const SimplePowerBIReportEmbed = ({ reports, reportConfiguration, scenario, lang }) => {
  const { reportId, settings, staticFilters, dynamicFilters, pageName } = reportConfiguration;

  const [embedConfig, setEmbedConfig] = useState({
    type: 'report',
    id: reportId,
    embedUrl: '',
    accessToken: '',
    tokenType: 1 // 1 Embed or 0 Aad
  });

  // Add custom filter here
  const additionalFilters = useMemo(() => PowerBIUtils.constructDynamicFilters(dynamicFilters, scenario), [dynamicFilters, scenario]);

  useEffect(() => {
    const newConfig = {
      type: 'report',
      id: reportId,
      tokenType: 1,
      embedUrl: reports.data?.embedUrl[reportId]?.embedUrl,
      accessToken: reports.data?.accessToken
    };

    if (pageName !== undefined && pageName[lang] !== undefined) {
      newConfig.pageName = pageName[lang];
    }

    if (settings !== undefined) {
      newConfig.settings = settings;
    }

    if (staticFilters !== undefined || additionalFilters !== undefined) {
      let filters = [];
      if (staticFilters !== undefined) {
        filters = filters.concat(staticFilters);
      }
      if (additionalFilters !== undefined) {
        filters = filters.concat(additionalFilters);
      }
      newConfig.filters = filters;
      console.log(filters);
    }
    setEmbedConfig(newConfig);
  }, [reports, staticFilters, settings, additionalFilters, reportId, pageName, lang]);

  return (<React.Fragment>
    <PowerBIEmbed embedConfig={embedConfig} />
  </React.Fragment>);
};

SimplePowerBIReportEmbed.propTypes = {
  reports: PropTypes.object.isRequired,
  reportConfiguration: PropTypes.object.isRequired,
  scenario: PropTypes.object,
  lang: PropTypes.string.isRequired
};

export default SimplePowerBIReportEmbed;
