# About customization

## Customization of About content component

By default, About content customization is set in the React component:
[src/components/AboutContent/AboutContent.js](../src/components/AboutContent/AboutContent.js)

## About content configuration

- In the same [AboutContent.js](../src/components/AboutContent/AboutContent.js) file,
  **title** and **text** contents are set through these translation keys:

  ```jsx
    <Grid className={classes.title} item>
      {t('genericcomponent.dialog.about.title')}
    </Grid>
    ...
    <Grid item className={classes.content}>
      {t('genericcomponent.dialog.about.content')}
    </Grid>
  ```

  and translation files:

  [public/locales/en/translation.json](../public/locales/en/translation.json)

  [public/locales/fr/translation.json](../public/locales/fr/translation.json)

- Webapp **version number** is automaticaly fetched from [package.json](package.json) at deployment.
  So, don't forget to keep up-to-date the variable `version`:

  ```json
  {
    "name": "azure-sample-webapp",
    "version": "2.1.0",
    "private": true,
    "dependencies": {
  ```

## Enable or disable About entry in help menu

In file [src/services/config/Menu.js](../src/services/config/Menu.js):

- To **enable** About entry in help menu.
  `About` constant must be set with **About content component**.

  By default, the constant is set like that:

  ```js
  import { AboutContent } from '../../components/AboutContent';

  export const About = AboutContent;
  ```

  If you want to use another component, don't forget to set correctly the `import` line.

- To **disable** About entry in help menu.
  `About` constant must be set as **_null_** :

  ```js
  // import { AboutContent } from '../../components/AboutContent';

  export const About = null;
  ```
