// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getCreateScenarioDialogLabels = (t, editMode) => {
  const createScenarioButtonTooltip = editMode
    ? t(
        'commoncomponents.button.create.scenario.tooltip.disabled',
        'Please save or discard current modifications before creating a new scenario'
      )
    : '';

  return {
    button: {
      title: t('commoncomponents.button.create.scenario.label', 'Create new Scenario'),
      tooltip: createScenarioButtonTooltip,
    },
    dialog: {
      title: t('commoncomponents.dialog.create.scenario.text.title', 'Create new Scenario'),
      scenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.label'),
      scenarioMaster: t('commoncomponents.dialog.create.scenario.checkbox.scenarioMaster.label', 'Master'),
      scenarioParent: t('commoncomponents.dialog.create.scenario.dropdown.parentscenario.label', 'Parent scenario'),
      datasetPlaceholder: t('commoncomponents.dialog.create.scenario.dropdown.dataset.placeholder', 'Dataset'),
      dataset: t('commoncomponents.dialog.create.scenario.dropdown.dataset.label', 'Select a dataset'),
      scenarioTypePlaceholder: t(
        'commoncomponents.dialog.create.scenario.dropdown.scenariotype.placeholder',
        'Scenario'
      ),
      scenarioType: t('commoncomponents.dialog.create.scenario.dropdown.scenariotype.label', 'Scenario Type'),
      cancel: t('commoncomponents.dialog.create.scenario.button.cancel', 'Cancel'),
      create: t('commoncomponents.dialog.create.scenario.button.create', 'Create'),
    },
    errors: {
      emptyScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.empty'),
      existingScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.existing'),
      forbiddenCharsInScenarioName: t(
        'commoncomponents.dialog.create.scenario.input.scenarioname.error.forbiddenchars'
      ),
    },
  };
};

export const getReportLabels = (t) => ({
  noScenario: {
    title: t('commoncomponents.iframe.scenario.noscenario.title', 'No scenario yet'),
    label: t(
      'commoncomponents.iframe.scenario.noscenario.label',
      'You can create a scenario by clicking on Create new Scenario'
    ),
  },
  noRun: {
    label: t('commoncomponents.iframe.scenario.results.label.uninitialized', 'The scenario has not been run yet'),
  },
  noDashboard: {
    label: t('commoncomponents.iframe.scenario.nodashboard.label'),
  },
  inProgress: {
    label: t('commoncomponents.iframe.scenario.results.label.running', 'Scenario run in progress...'),
  },
  hasErrors: {
    label: t('commoncomponents.iframe.scenario.results.text.error', 'An error occured during the scenario run'),
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
