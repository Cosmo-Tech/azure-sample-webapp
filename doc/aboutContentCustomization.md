# About component customization

!["About" card -- webapp version & contact details](./assets/about.png)

By default, the azure-sample-webapp provides a custom "_About_" message displayed in a pop-up, accessible via the "Help"
menu in the top right corner. This dialog provides users with details about the **webapp version**, a **short
description**, and **Cosmo Tech contact information**, but you can adapt its content if you wish to do so. This document
will present how to configure minor changes to the default component, and how you can provide your own React component
to replace the default one.

## Configuration of the default "About" component

The default React component for the "About" section can be found in
[src/components/AboutContent/AboutContent.js](../src/components/AboutContent/AboutContent.js). Please note though that
**it is strongly advised not to modify this file directly**, to minimize the risk of conflicts with future updates of
the webapp.

Several parts of the default content can be configured:

- the title and description
- the organization logo
- the version number
- links to the support page and to your organization website

### Title & description

You can modify the card title and the short description text by modifying the values of
`genericcomponent.dialog.about.title` and `genericcomponent.dialog.about.content`, in both translation files
[public/locales/en/translation.json](../public/locales/en/translation.json) and
[public/locales/fr/translation.json](../public/locales/fr/translation.json).

### Organization logo

The organization logo can be replaced in the theme configuration: please refer to
[HelpMenu Configuration](helpMenuConfiguration.md).

### Webapp version number

The webapp version number can be configured in
[src/config/HelpMenuConfiguration.json](../src/config/HelpMenuConfiguration.json), in the `APP_VERSION` field. Yet,
instead of hard-coding the version number in this configuration file (which would make the release process error-prone),
the version number is automatically set on webapp start (in "local dev" mode) or during the webapp build (for deployed
webapps), based on the version number in the [package.json](../package.json) file:

```json
{
  "name": "azure-sample-webapp",
  "version": "5.0.0"
}
```

The npm scripts "start" and "build" in the [package.json](../package.json) file are responsible for setting the
environment variable `REACT_APP_APP_VERSION`. If you prefer to use the hard-coded value in the configuration file
instead, then you have to remove the part ` REACT_APP_APP_VERSION=$npm_package_version` in the
scripts, in the [package.json](../package.json) file. Replace:

```json
"scripts": {
  "start": "cross-env ESLINT_NO_DEV_ERRORS=true REACT_APP_APP_VERSION=$npm_package_version react-app-rewired start",
  "build": "cross-env DISABLE_ESLINT_PLUGIN=true REACT_APP_APP_VERSION=$npm_package_version react-app-rewired build",
}
```

by:

```json
"scripts": {
  "start": "cross-env ESLINT_NO_DEV_ERRORS=true react-app-rewired start",
  "build": "cross-env DISABLE_ESLINT_PLUGIN=true react-app-rewired build",
}
```

### Link to support page & organization website

These links can be defined in several ways:

- the most straightforward way is to set the values `COSMOTECH_URL` and `SUPPORT_URL` in the file
  _src/config/HelpMenuConfiguration.json_
- for automation purposes, these parameters can be overridden by setting the environment variables
  `REACT_APP_COSMOTECH_URL` and `REACT_APP_SUPPORT_URL`
- finally, values for these links can be **customized for each workspace**, by setting these parameters in the workspace
  data:
  - `[workspace].webApp.options.menu.supportUrl`
  - `[workspace].webApp.options.menu.organizationUrl`

## Replacing the About component

If you prefer to write your own React component, open the file
[src/services/config/Menu.js](../src/services/config/Menu.js) and replace the imported component:

```js
import { AboutContent } from '../../components/AboutContent'; // Import your component instead
export const About = AboutContent; // Use your component instead
```

## Disabling the About pop-up

Finally, if you'd rather not display any "About" pop-up and remove the associated item in the "Help" menu, open the file
[src/services/config/Menu.js](../src/services/config/Menu.js) and set the exported variable to `null`:

```js
// import { AboutContent } from '../../components/AboutContent';
export const About = null;
```
