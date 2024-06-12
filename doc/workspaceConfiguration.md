# Workspace configuration

Some features of the webapp can be configured in your workspace description. These are usually versioned in
_Workspace.yaml_ or _Workspace.json_ files, that you can then upload with the Cosmo Tech API to create or update a
workspace. The features that can be configured from the workspace description will be listed below.

## Configurable views

The following pages of the webapp depend on the workspace configuration:

- Dashboards view (see documentation [here](powerBI.md))
- Digital Twin view (see documentation [here](instanceVisualization.md))

## Help menu configuration

The "_Help_" menu contains information related to webapp functioning and maintenance. It can be found in the top-right
corner of the webapp, next to the user avatar.

Some items of the "_Help_" menu can be configured from the file
[src/config/HelpMenuConfiguration.json](../src/config/HelpMenuConfiguration.json):

- `APP_VERSION` is the webapp version number, that will be displayed in the "_About_" pop-up
- `COSMOTECH_URL` is the url (expressed as a string) to redirect users to your organization website, displayed in the
  "_About_" pop-up
- `SUPPORT_URL` is the url (expressed as a string) of the support page. Links to this page will be shown in the
  "_About_" pop-up, and as a redirection button in the "_Help_" menu. If this value is set to `null`, the associated
  links will be hidden
- `DOCUMENTATION_URL` is either a **relative path** (from the "_public_" folder) to the documentation file, or a
  **URL** to your documentation home page

Except the app version, all these values can be **customized for each workspace**, by setting them in the workspace
data:

- `[workspace].webApp.options.menu.documentationUrl`
- `[workspace].webApp.options.menu.supportUrl`
- `[workspace].webApp.options.menu.organizationUrl`

## Other options

- `[workspace].webApp.options.disableOutOfSyncWarningBanner` (optional) boolean value; when set to `true` the
  warning frame around scenario results in the Scenario view will be disabled (default value is `false`)
- `[workspace].webApp.options.datasetFilter` (optional) this parameter must be a list of strings, where each string
  represents the id of a dataset; this is a whitelist of datasets to show in the scenario creation pop-up. If the
  parameter is null or if the list is empty, then the filter is ignored and all datasets with the tag `dataset` will be
  shown.
  > **Warning**
  >
  > This property `[workspace].webApp.options.datasetFilter` is deprecated. Please use the Cosmo Tech API to link or unlink dataset to the workspace
