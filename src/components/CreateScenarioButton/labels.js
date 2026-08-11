// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getCreateScenarioDialogLabels = (t, disabled) => {
  const createScenarioButtonTooltip = disabled
    ? t(
        'commoncomponents.button.create.scenario.tooltip.disabled',
        'Please save or discard current modifications before creating a new scenario'
      )
    : t('commoncomponents.button.create.scenario.label', 'Create');

  return {
    button: {
      title: t('commoncomponents.button.create.scenario.label', 'Create'),
      tooltip: createScenarioButtonTooltip,
    },
    dialog: {
      title: t('commoncomponents.dialog.create.scenario.text.title', 'Create new Scenario'),
      scenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.label', 'Scenario name'),
      scenarioMaster: t('commoncomponents.dialog.create.scenario.checkbox.scenarioMaster.label', 'Master'),
      scenarioDescription: t('commoncomponents.dialog.create.scenario.input.description', 'Description'),
      scenarioTags: t('commoncomponents.dialog.create.scenario.input.tags', 'Tags'),
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
      emptyScenarioName: t(
        'commoncomponents.dialog.create.scenario.input.scenarioname.error.empty',
        'Scenario name cannot be empty'
      ),
      existingScenarioName: t(
        'commoncomponents.dialog.create.scenario.input.scenarioname.error.existing',
        'Scenario name already exists'
      ),
      forbiddenCharsInScenarioName: t(
        'commoncomponents.dialog.create.scenario.input.scenarioname.error.forbiddenchars',
        'Scenario name has to start with a letter or a digit, and can only contain letters, digits, spaces, ' +
          'underscores, hyphens and dots.'
      ),
    },
  };
};

export const getScenarioEditionLabels = (t, scenario, disabled = false) => {
  // The 'disabled' argument can be omitted here because we'll override the associated label
  const labels = getCreateScenarioDialogLabels(t);
  if (disabled)
    labels.button.tooltip = t(
      'commoncomponents.button.scenario.edit.tooltipIfDisabled',
      'You do not have the required permissions to edit this scenario'
    );
  else labels.button.tooltip = t('commoncomponents.button.scenario.edit.label', 'Edit');

  labels.button.title = t('commoncomponents.button.scenario.edit.label', 'Edit');
  labels.dialog.title = t(
    'commoncomponents.button.scenario.edit.dialogTitle',
    { scenarioName: scenario?.name },
    'Edit scenario "{{scenarioName}}"'
  );
  labels.dialog.create = t('commoncomponents.button.scenario.edit.confirm', 'Edit');
  return labels;
};
