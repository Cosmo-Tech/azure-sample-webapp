// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
import ConfigService from '../../services/ConfigService';

// Application Insight configuration
export const APPLICATION_INSIGHTS_CONFIG = {
  name: 'Web Application Sample',
  config: {
    disableCookiesUsage: true,
    instrumentationKey: ConfigService.getParameterValue('APPLICATION_INSIGHTS_INSTRUMENTATION_KEY'),
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C,
  },
};
