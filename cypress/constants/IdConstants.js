export const SELECTORS = {
  login: {
    microsoftLoginButton: '[data-cy=sign-in-with-microsoft-button]'
  },
  userProfileMenu: {
    menu: '[data-cy=user-profile-menu]',
    logout: '[data-cy=logout]',
    language: {
      change: '[data-cy=change-language]',
      en: '[data-cy=set-lang-en]',
      fr: '[data-cy=set-lang-fr]'
    }
  },
  scenario: {
    view: '[data-cy=scenario-view]',
    dashboard: {
      placeholder: '[data-cy=dashboard-placeholder]'
    },
    selectInput: '[data-cy=scenario-select-input]',
    parameters: {
      tabs: '[data-cy=scenario-parameters-tabs]',
      editButton: '[data-cy=edit-parameters-button]',
      updateAndLaunchButton: '[data-cy=update-and-launch-scenario]',
      stockInput: '[data-cy=stock-input]',
      restockInput: '[data-cy=restock-input]',
      waitersInput: '[data-cy=waiters-input]'

    },
    createButton: '[data-cy=create-scenario-button]',
    createDialog: {
      dialog: '[data-cy=create-scenario-dialog]',
      masterCheckbox: '[data-cy=create-scenario-dialog-master-checkbox]',
      nameTextfield: '[data-cy=create-scenario-dialog-name-textfield]',
      datasetSelect: '[data-cy=create-scenario-dialog-dataset-select]',
      typeSelect: '[data-cy=create-scenario-dialog-type-select]',
      submitButton: '[data-cy=create-scenario-dialog-submit-button]'
    }
  }
};
