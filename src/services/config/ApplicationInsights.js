// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
import { APPLICATION_INSIGHTS_INSTRUMENTATION_KEY } from '../../config/AppInstance.js';

// Application Insight configuration
export const APPLICATION_INSIGHTS_CONFIG = {
  name: 'Web Application Sample',
  config: {
    instrumentationKey: APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C
  }
};
