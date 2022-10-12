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
      "There isn't any dashboard configured for this run template"
    ),
  },
  inProgress: {
    label: t('commoncomponents.iframe.scenario.results.label.running', 'Scenario run in progress...'),
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
export const getShareScenarioDialogLabels = (t, currentScenarioName) => ({
  button: {
    title: t('commoncomponents.dialog.share.button.label', 'Share'),
    tooltip: t('commoncomponents.dialog.share.button.tooltip', 'Modify access'),
  },
  dialog: {
    title: t('commoncomponents.dialog.share.dialog.title', 'Share ') + currentScenarioName,
    addPeople: t('commoncomponents.dialog.share.dialog.select.addPeople', 'Add people'),
    cancel: t('commoncomponents.dialog.share.dialog.buttons.cancel', 'Cancel'),
    share: t('commoncomponents.dialog.share.dialog.buttons.share', 'Share'),
    noAdminError: t(
      'commoncomponents.dialog.share.dialog.error.noAdmin',
      'The scenario must have at least one administrator'
    ),
    userSelected: t('commoncomponents.dialog.share.dialog.select.userSelected', 'Selected user'),
    usersAccess: t('commoncomponents.dialog.share.dialog.editor.usersAccess', 'Users access'),
    generalAccess: t('commoncomponents.dialog.share.dialog.editor.generalAccess', 'General access'),
    removeAccess: t('commoncomponents.dialog.share.dialog.editor.removeAccess', 'Remove specific access'),
    editor: {
      helperText: {
        admin: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.admin',
          'Anyone in this workspace can view, create, launch, edit the scenario and modify access to it'
        ),
        viewer: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.viewer',
          'Anyone in this workspace can view scenario and its results'
        ),
        validator: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.validator',
          'Anyone in this workspace can view, create, launch, edit the scenario and change its validation status'
        ),
        editor: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.editor',
          'Anyone in this workspace can view, launch, edit the scenario'
        ),
        none: t('commoncomponents.dialog.share.dialog.editor.helperText.none', 'Other users cannot view the scenario'),
      },
    },
    add: {
      cancel: t('commoncomponents.dialog.share.dialog.buttons.cancel', 'Cancel'),
      deniedPermissions: t('commoncomponents.dialog.share.dialog.add.deniedPermissions', 'Not granted permissions'),
      done: t('commoncomponents.dialog.share.dialog.buttons.done', 'Done'),
      grantedPermissions: t('commoncomponents.dialog.share.dialog.add.grantedPermissions', 'Granted permissions'),
      rolesTitle: t('commoncomponents.dialog.share.dialog.add.rolesTitle', 'Roles'),
      userSelected: t('commoncomponents.dialog.share.dialog.select.userSelected', 'Selected user'),
      rolesHelperText: t('commoncomponents.dialog.share.dialog.add.rolesHelperText', 'Select one role'),
    },
  },
});
export const getRolesLabels = (t, rolesNames) => {
  const rolesLabels = [];
  rolesNames.forEach((roleName) =>
    rolesLabels.push({ value: roleName, label: t(`commoncomponents.dialog.share.roles.${roleName}`, roleName) })
  );
  return rolesLabels;
};

export const getPermissionsLabels = (t, permissionsNames) => {
  const permissionsLabels = [];
  permissionsNames.forEach((permissionName) =>
    permissionsLabels.push({
      value: permissionName,
      label: t(`commoncomponents.dialog.share.permissions.${permissionName}`, permissionName),
    })
  );
  return permissionsLabels;
};
