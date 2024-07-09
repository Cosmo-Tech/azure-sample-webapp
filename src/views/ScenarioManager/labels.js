// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getScenarioManagerLabels = (t) => ({
  status: t('commoncomponents.scenariomanager.treelist.node.status.label'),
  runTemplateLabel: t('commoncomponents.scenariomanager.treelist.node.runTemplate'),
  successful: t('commoncomponents.scenariomanager.treelist.node.status.successful'),
  running: t('commoncomponents.scenariomanager.treelist.node.status.running'),
  dataingestioninprogress: t('commoncomponents.scenariomanager.treelist.node.status.dataingestioninprogress'),
  failed: t('commoncomponents.scenariomanager.treelist.node.status.failed'),
  created: t('commoncomponents.scenariomanager.treelist.node.status.created'),
  delete: t('commoncomponents.scenariomanager.treelist.node.action.delete'),
  edit: t('commoncomponents.scenariomanager.treelist.node.action.edit'),
  scenarioRename: {
    title: t('commoncomponents.dialog.create.scenario.input.scenarioname.label'),
    errors: {
      emptyScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.empty'),
      forbiddenCharsInScenarioName: t(
        'commoncomponents.dialog.create.scenario.input.scenarioname.error.forbiddenchars'
      ),
      existingScenarioName: t('commoncomponents.dialog.create.scenario.input.scenarioname.error.existing'),
    },
  },
  deleteDialog: {
    description: t(
      'commoncomponents.dialog.confirm.delete.description',
      'This operation is irreversible. Dataset(s) will not be removed, but the scenario parameters will be lost. ' +
        'If this scenario has children, they will be moved to a new parent. ' +
        'The new parent will be the parent of the deleted scenario.'
    ),
    cancel: t('commoncomponents.dialog.confirm.delete.button.cancel', 'Cancel'),
    confirm: t('commoncomponents.dialog.confirm.delete.button.confirm', 'Confirm'),
  },
  searchField: t('commoncomponents.scenariomanager.treelist.node.text.search'),
  toolbar: {
    expandAll: t('commoncomponents.scenariomanager.toolbar.expandAll', 'Expand all'),
    expandTree: t('commoncomponents.scenariomanager.toolbar.expandTree', 'Expand tree'),
    collapseAll: t('commoncomponents.scenariomanager.toolbar.collapseAll', 'Collapse all'),
  },
  validationStatus: {
    rejected: t('views.scenario.validation.rejected', 'Rejected'),
    validated: t('views.scenario.validation.validated', 'Validated'),
  },
});
