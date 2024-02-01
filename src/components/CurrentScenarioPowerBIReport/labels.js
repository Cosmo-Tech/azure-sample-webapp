// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getReportLabels = (t) => ({
  noScenario: {
    title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
    label: t(
      'commoncomponents.iframe.scenario.noscenario.label',
      'You can create a scenario by clicking on the CREATE button'
    ),
  },
  noRun: {
    label: t('commoncomponents.iframe.scenario.results.label.uninitialized', 'The scenario has not been run yet'),
  },
  noDashboard: {
    label: t(
      'commoncomponents.iframe.scenario.nodashboard.label',
      "There isn't any dashboard configured for this run type"
    ),
  },
  inProgress: {
    label: t('commoncomponents.iframe.scenario.results.label.running', 'Scenario run in progress...'),
  },
  dataInTransfer: {
    label: t(
      'commoncomponents.iframe.scenario.results.label.dataInTransfer',
      'Transfer of scenario results in progress...'
    ),
  },
  hasErrors: {
    label: t('commoncomponents.iframe.scenario.results.label.error', 'An error occured during the scenario run'),
  },
  hasUnknownStatus: {
    label: t(
      'commoncomponents.iframe.scenario.unknownStatus.label',
      'This scenario has an unknown state, if the problem persists, please, contact your administrator'
    ),
  },
  downloadButton: t('commoncomponents.iframe.scenario.results.button.downloadLogs', 'Download logs'),
  refreshTooltip: t('commoncomponents.iframe.scenario.results.button.refresh', 'Refresh'),
  errors: {
    unknown: t('commoncomponents.iframe.scenario.error.unknown.label', 'Unknown error'),
    details: t(
      'commoncomponents.iframe.scenario.error.unknown.details',
      'Something went wrong when fetching PowerBI reports info'
    ),
  },
});
