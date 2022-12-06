// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getCreateScenarioDialogLabels = (t, disabled) => {
  const createScenarioButtonTooltip = disabled
    ? t(
        'commoncomponents.button.create.scenario.tooltip.disabled',
        'Please save or discard current modifications before creating a new scenario'
      )
    : '';

  return {
    button: {
      title: t('commoncomponents.button.create.scenario.label', 'Create'),
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
