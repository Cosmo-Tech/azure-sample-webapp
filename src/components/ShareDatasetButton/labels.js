// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getShareDatasetDialogLabels = (t, currentDatasetName) => ({
  button: {
    title: t('commoncomponents.dialog.share.button.label', 'Share'),
    tooltip: t('commoncomponents.datasetmanager.overview.actions.shareButtonTooltip', 'Share'),
  },
  dialog: {
    title: t('commoncomponents.dialog.share.dialog.title', 'Share ') + currentDatasetName,
    readOnlyTitle: t('commoncomponents.dialog.share.dialog.readOnlyTitle', 'Permissions for ') + currentDatasetName,
    addPeople: t('commoncomponents.dialog.share.dialog.select.addPeople', 'Add people'),
    cancel: t('commoncomponents.dialog.share.dialog.buttons.cancel', 'Cancel'),
    close: t('commoncomponents.dialog.share.dialog.buttons.close', 'Close'),
    share: t('commoncomponents.dialog.share.dialog.buttons.share', 'Share'),
    noAdminError: t(
      'commoncomponents.dialog.share.dialog.error.datasetNoAdmin',
      'The dataset must have at least one administrator'
    ),
    userSelected: t('commoncomponents.dialog.share.dialog.select.userSelected', 'Selected user'),
    usersAccess: t('commoncomponents.dialog.share.dialog.editor.usersAccess', 'Users access'),
    generalAccess: t('commoncomponents.dialog.share.dialog.editor.generalAccess', 'General access'),
    removeAccess: t('commoncomponents.dialog.share.dialog.editor.removeAccess', 'Remove specific access'),
    editor: {
      helperText: {
        admin: t('commoncomponents.dialog.share.dialog.editor.helperText.admin', 'Anyone in this workspace is admin'),
        viewer: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.viewer',
          'Anyone in this workspace is viewer'
        ),
        validator: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.validator',
          'Anyone in this workspace is validator'
        ),
        editor: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.editor',
          'Anyone in this workspace is editor'
        ),
        none: t(
          'commoncomponents.dialog.share.dialog.editor.helperText.datasetNone',
          'Other users cannot view the dataset'
        ),
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
