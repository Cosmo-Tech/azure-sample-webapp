// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { APPLICATION_INSIGHTS_CONFIG } from './config/ApplicationInsights';
import { ENABLE_APPLICATION_INSIGHTS } from '../config/AppConfiguration';

class AppInsightsSingleton {
  constructor () {
    if (AppInsightsSingleton._instance) {
      return AppInsightsSingleton._instance;
    }
    AppInsightsSingleton._instance = this;

    this.enabled = false;
    this.currentScenario = {};

    if (ENABLE_APPLICATION_INSIGHTS && APPLICATION_INSIGHTS_CONFIG.config.instrumentationKey) {
      this.appInsights = new ApplicationInsights(APPLICATION_INSIGHTS_CONFIG);
      this.appInsights.loadAppInsights();
      this.appInsights.trackPageView();
      this.enabled = true;
    }
  }

  setScenarioData (scenario) {
    if (!scenario) { return; }
    this.currentScenario = {
      id: scenario.id,
      parentId: scenario.parentId,
      rootId: scenario.rootId
    };
  }

  trackUpload () {
    if (this.enabled) {
      this.appInsights.trackMetric({ name: 'UploadFileValue', average: 1, sampleCount: 1 });
    }
  }

  trackDownload () {
    if (this.enabled) {
      this.appInsights.trackMetric({ name: 'DownloadFileValue', average: 1, sampleCount: 1 });
    }
  }

  trackScenarioCreation () {
    if (this.enabled) {
      this.appInsights.trackMetric({ name: 'CreateScenarioValue', average: 1, sampleCount: 1 });
    }
  }

  trackScenarioLaunch () {
    if (this.enabled) {
      this.appInsights.trackMetric({ name: 'LaunchScenarioValue', average: 1, sampleCount: 1 });
    }
  }
}

function getInstance () {
  return new AppInsightsSingleton();
}

export const AppInsights = {
  getInstance: getInstance
};
