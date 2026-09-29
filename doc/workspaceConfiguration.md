# Workspace configuration

Some features of the webapp can be configured in your workspace description. These are usually versioned in
_Workspace.yaml_ or _Workspace.json_ files, that you can then upload with the Cosmo Tech API to create or update a
workspace. The features that can be configured from the workspace description will be listed below.

## Configurable views

The following pages of the webapp depend on the workspace configuration:

- Dataset Manager view (see documentation [here](datasetManager.md))
- Dashboards view (see documentation [here](powerBI.md))
- Digital Twin view (see documentation [here](instanceVisualization.md))

## Solution configuration

Whether your project has several workspaces using the same solution, or your solution contains more logic than you want
to expose in the webapp, you might want to customize some elements of the solution **for each workspace**.

In your workspace configuration, you can define `additionalData.webapp.solution.runTemplateFilter` to
**filter which run templates are listed** when users create new scenarios in the webapp. The value for this option
must be a **list** containing the **ids of the run templates** you want to show.

Example:

```yaml
additionalData:
  webapp:
    solution:
      runTemplateFilter:
        - 'full_demo'
        - 'sim_no_parameters'
        - 'sim_mock_parameters'
        - 'dynamic_values_customers'
        - 'standalone'
```

## Help menu configuration

The "_Help_" menu contains information related to webapp functioning and maintenance. It can be found in the top-right
corner of the webapp, next to the user avatar.

Some items of the "_Help_" menu can be configured from the file
[src/config/HelpMenuConfiguration.json](../src/config/HelpMenuConfiguration.json):

- `APP_VERSION` is the webapp version number, that will be displayed in the "_About_" pop-up
- `BUILD_NUMBER` is an option to display a specific build number, next the to the app version
- `ORGANIZATION_URL` is the url (expressed as a string) to redirect users to your organization website, displayed in the
  "_About_" pop-up
- `SUPPORT_URL` is the url (expressed as a string) of the support page. Links to this page will be shown in the
  "_About_" pop-up, and as a redirection button in the "_Help_" menu. If this value is set to `null`, the associated
  links will be hidden
- `DOCUMENTATION_URL` is either a **relative path** (from the "_public_" folder) to the documentation file, or a
  **URL** to your documentation home page

Except the app version, all these values can be **customized for each workspace**, by setting them in the workspace
data:

- `additionalData.webapp.menu.documentationUrl`
- `additionalData.webapp.menu.supportUrl`
- `additionalData.webapp.menu.organizationUrl`

## Other options

- `additionalData.webapp.disableOutOfSyncWarningBanner` (optional) boolean value; when set to `false` a warning frame
  around scenario results will be displayed in the Scenario view when the parameters haven been changed after the last
  scenario run (since v7.0.0, the default value for this option is `true`)
