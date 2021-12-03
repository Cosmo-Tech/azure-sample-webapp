// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const GENERIC_SELECTORS = {
  login: {
    microsoftLoginButton: '[data-cy=sign-in-with-microsoft-button]',
  },
  userInfoMenu: {
    button: '[data-cy=user-profile-menu]',
    popover: '[data-cy=main-menu]',
    logout: '[data-cy=logout]',
    language: {
      change: '[data-cy=change-language]',
      en: '[data-cy=set-lang-en]',
      fr: '[data-cy=set-lang-fr]',
    },
  },
  helpMenu: {
    menu: '[data-cy=help-menu]',
  },
  scenario: {
    view: '[data-cy=scenario-view]',
    tabName: '[data-cy="tabs.scenariomanager.key"]',
    dashboard: {
      placeholder: '[data-cy=dashboard-placeholder]',
    },
    selectInput: '[data-cy=scenario-select-input]',
    parameters: {
      tabs: '[data-cy=scenario-parameters-tabs]',
      editButton: '[data-cy=edit-parameters-button]',
      updateAndLaunchButton: '[data-cy=update-and-launch-scenario]',
      discardButton: '[data-cy=discard-button]',
      dialogDiscardButton: '[data-cy=discard-changes-button2]',
    },
    createButton: '[data-cy=create-scenario-button]',
    createDialog: {
      dialog: '[data-cy=create-scenario-dialog]',
      masterCheckbox: 'input[id=isScenarioMaster]',
      nameTextfield: '[data-cy=create-scenario-dialog-name-textfield]',
      datasetSelect: '[data-cy=create-scenario-dialog-dataset-select]',
      typeSelect: '[data-cy=create-scenario-dialog-type-select]',
      submitButton: '[data-cy=create-scenario-dialog-submit-button]',
    },
    manager: {
      tabName: '[data-cy="tabs.scenariomanager.key"]',
      confirmDeleteDialog: '[data-cy=confirm-scenario-delete-dialog]',
      search: '[data-cy=scenario-manager-search-field]',
      button: {
        delete: '[data-cy=scenario-delete-button]',
      },
    },
  },
  genericComponents: {
    uploadFile: {
      browseButtonInput: 'input[type=file]',
      downloadButton: '[data-cy=download-button]',
      deleteButton: '[data-cy=delete-button]',
      fileName: '[data-cy=file-name]',
    },
    table: {
      label: '[data-cy=label]',
      grid: '[data-cy=grid]',
      csvImportButton: '[data-cy=import-csv-button]',
      csvImportButtonInput: 'input[type=file]',
      csvExportButton: '[data-cy=export-csv-button]',
      header: '[class=ag-header-viewport]',
      colByName: '[col-id=$COLNAME]',
      rowsContainer: '[class=ag-center-cols-container]',
      row: '.ag-row',
      rowByIndex: '[row-index="$ROWINDEX"]',
    },
    basicEnumInput: {
      input: 'input',
      textField: '[data-cy=text_field]',
    },
    basicTextInput: {
      input: 'input',
    },
    basicNumberInput: {
      input: 'input',
    },
  },
};
