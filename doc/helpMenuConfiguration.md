# Help menu configuration

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
