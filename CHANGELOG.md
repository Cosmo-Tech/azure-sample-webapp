## **2.6.0** <sub><sup>2022-04-29 ([8bf8666...db6439a](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/8bf8666...db6439a?diff=split))</sup></sub>

### Documentation

- add doc for iframe ratio configuration ([cb4cbba](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cb4cbba))
- documentation for Azure custom metrics ([3ccd690](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3ccd690))
- fix broken link in doc for custom metrics ([cea8ad8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cea8ad8))
- add note to fix possible AppInsights activation error message ([a177318](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a177318))
- minor improvements ([c87bdc9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c87bdc9))

### Features

- add DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO parameter in webapp config ([f264aa5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f264aa5))
- add scenario validation status in scenario & scenario manager views ([91f7678](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/91f7678))

### Bug Fixes

- fix AzureFunction error on missing config ([b58fa48](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b58fa48))
- change success color value in theme ([fd0feaf](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fd0feaf))

## **2.5.0** <sub><sup>2022-04-04 ([65864b3...81c4e58](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/65864b3...81c4e58?diff=split))</sup></sub>

### Features

- add getFirstScenarioMaster function in utils ([62b147f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/62b147f))
- implement scenario run duration tracking ([4fc8523](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4fc8523))
- make scenario parameters collapsable and move it above dashboards ([04f971f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/04f971f))
- set Cosmo platform\-help URL page as documentation instead of previously used pdf file ([88db4a1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/88db4a1))
- add scenario launch confirmation dialog ([282d3ab](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/282d3ab))
- add automatic expansion of the scenario parameters accordion when create scenario ([bf66e73](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bf66e73))
- add redirection to selected scenario view from scenario manager ([99c55d5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/99c55d5))
- add new webapp configuration parameter SCENARIO_VIEW_IFRAME_DISPLAY_RATIO ([920bbb8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/920bbb8))

### Bug Fixes

- default current scenario is now first scenario in alphabetical order ([5567aa3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5567aa3))
- fix file import ignored if table was manually edited before ([56fe7ff](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/56fe7ff))
- remove unused Footer component and space reserved for footer ([78053f0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/78053f0))
- fix default label of scenario selector in Scenario view ([43d3466](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/43d3466))
- made a lock function per Table parameter instead of global one ([bb27eaf](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bb27eaf))
- prevent race conditions when setting some scenario parameters state ([7277ab9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7277ab9))
- force column layout for scenario parameters in tab ([9b34704](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9b34704))
- fix date input layout ([9b34704](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9b34704))
- fix missing part of label displayed when no scenarios exist ([478d659](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/478d659))
- fix scenario state not updated in scenarios list when running \(PROD\-8039\) ([bc5c182](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bc5c182))

### Documentation

- add description of defaultValue for File and Table parameters ([7e01013](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7e01013))

## **2.4.0** <sub><sup>2022-01-26 ([a56f333...b49a1e1](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/a56f333...b49a1e1?diff=split))</sup></sub>

### Features

- add About button in help menu ([e747ef7](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e747ef7))
- add Cosmotech website url in App config ([e670fde](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e670fde))
- dashboards now have an option _alwaysShowReports_ to prevent place holder from being displayed ([daaddea](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/daaddea))

### Bug Fixes

- fix empty field when typing zero in a number input ([b0f25d3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b0f25d3))

### Documentation

- document how to customize the "About" menu content ([d5d7245](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d5d7245))
- minor changes ([28313ef](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/28313ef))

## **2.3.0** <sub><sup>2022-01-11 ([66c2e5f...bb09165](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/66c2e5f...bb09165?diff=split))</sup></sub>

### Features

- Ag Grid theme is now setable in themes config ([8c87dee](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8c87dee))
- add XLSX Import feature ([2548e44](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2548e44))

### Bug Fixes

- fix application crash on use of unknown parameters group in solution run templates ([e759e48](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e759e48))
- use constant name based on parameter id on CSV export ([27e77b6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/27e77b6))
- Logo not displayed properly with dark theme ([07a5470](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/07a5470))
- Fix authentication picture ([632af09](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/632af09))
- improve warning message on undefined dataset connector ([1ed835d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1ed835d))
- fix scenario parameters changes loss on file upload ([b793159](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b793159))

### Documentation

- add note on power bi connection type ([63d11fe](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/63d11fe))
- precise how to use DOCUMENTATION_URL ([2192c4a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2192c4a))
- fix typo ([3112361](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3112361))
- add theme custo md in doc ToC ([a5c9ef6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a5c9ef6))

## **2.2.0** <sub><sup>2021-12-03 ([b0f8342...254b94c](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/b0f8342...254b94c?diff=split))</sup></sub>

### Features

- add support for **AAD authentication mode** in Power BI dashboards
- add **user roles** support with actions & parameters groups restrictions
- add support for **Table** scenario parameters
- use workspace _runTemplateFilter_ info to filter run templates in scenario creation dialog
- add scenario's name in the delete confirmation dialog, in the scenario manager

### Bug Fixes

- fix `yarn start` and `yarn build` scripts behavior on Windows
- tweak colors palette for dark and light themes

### Documentation

- add documentation for additional scenario run parameters
- add documentation PowerBI SSO configuration
- add documentation for authorizedRoles and showParameterGroupIfNoPermission
- add documentation for table parameters
- add documentation for ENABLE_APPLICATION_INSIGHTS configuration parameter
- add recommendations for dashboards size

## **2.1.0** <sub><sup>2021-11-02 ([2ec563c...69636de](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/2ec563c...69636de?diff=split))</sup></sub>

### Features

- Add help menu in tab layout ([a58a60a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a58a60a))
- Add extendedVarType management for ScenarioParameters/defaultValues ([2b2b8bb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2b2b8bb))([6bd5466](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6bd5466))
- Add fallback mechanism for parameterVarType in ScenarioParameterInputFactory ([d35250a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d35250a))
- Send defined additional scenario parameters for scenario run ([3720375](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3720375))

### Bug Fixes

- Remove unused brewery\-specific labels from translation files ([2ec563c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2ec563c))
- Remove trailing slash characters in default base path to prevent CORS errors ([c19e61c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c19e61c))
- Fix former parameters values appearance bug during update ([50cbc1d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/50cbc1d))
- Format scenario parameters for updateScenario API call ([951f841](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/951f841))
- Fix colors for scenario states in scenario manager ([0eb0e7e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0eb0e7e))

### Documentation

- Scenario Parameters advanced customization
- Minor improvements

## **2.0.0** <sub><sup>2021-10-20 ([7d402f2...a450550](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/7d402f2...a450550?diff=split))</sup></sub>

### Breaking changes

- Scenario parameters management refactored ([01dc0f4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/01dc0f4))
- Reorganise configurations and tests

### Features

- Add Prettier and format all files ([1a7c611](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1a7c611))

### Bug Fixes

- Alphabetic order for scenario list ([3226f59](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3226f59))
- Use a lighter color for dialogs ([a691e8b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a691e8b))
- Labels layout in Dahsboards left menu ([37401dd](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/37401dd))
- Unexcepted no scenario placeholder display after scenario create ([2c171a2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2c171a2))
- update config for multiple files ([a388cdb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a388cdb))
- Right\-align labels in dashboards menu ([d43f587](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d43f587))
- \.eslintrc file in cypress folder ([665ee57](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/665ee57))
- Breaking change in i18next config ([d45ec5a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d45ec5a))
- Weird behaviour of Chrome/Edge on input type file ([19bb638](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/19bb638))

### Documentation

- Change all Scenario Parameters part
- Fix broken links
- Improve documentation
