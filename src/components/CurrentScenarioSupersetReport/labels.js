// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
export const getReportLabels = (t) => ({
  noScenario: t(
    'commoncomponents.iframe.scenario.results.label.noscenario',
    'You need to create and run a scenario before being able to display a report'
  ),
  scenarioStillRunning: t(
    'commoncomponents.iframe.scenario.results.label.stillrunning',
    'Your scenario is still running, please wait for its completion to display a report'
  ),
  noReport: t(
    'commoncomponents.iframe.scenario.results.label.noreport',
    'No report has been defined in your scenario. Please contact an administrator'
  ),
  noScenarioRun: t(
    'commoncomponents.iframe.scenario.results.label.noscenariorun',
    'Your scenario has not run yet, please run it to get results'
  ),
  downloadButtonText: t('commoncomponents.button.download.logs.label', 'Download logs'),
  scenarioWithError: t(
    'commoncomponents.iframe.scenario.results.label.scenariowitherror',
    'Your scenario run has failed, please check the logs and run it again'
  ),
});
