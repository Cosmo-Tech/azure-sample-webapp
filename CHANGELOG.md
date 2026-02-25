## **7.0.0** <sub><sup>2026-02-23</sup></sub>

### BREAKING CHANGES

- **dropped features**:
  - removed support of Azure Application Insights
  - removed support of Azure Digital Twin
  - removed "_csm simulation run_" options in PowerBI dynamic filters (use "_last run id_" instead)
  - removed dataset rollback button in dataset manager
- **deprecated features**:
  - removed support of the _Digital Twin_ view (a.k.a. flowchart)
  - webapp **deployment with Azure Static Web Apps is now deprecated**; Azure deployment should still work but it is no longer officially supported and some features might be broken (e.g. embedded Superset dashboards)
- breaking changes in **workspace configuration**:
  - `webApp.options` moved to `additionalData.webapp`
  - **cypher queries** used in dynamic values and in the dataset manager have been **replaced by dataset part queries**
  - renamed `datasetManager.graphIndicators` to `datasetManager.kpiCards`
  - the **banner warning** users that scenario results might not be up-to-date is now **disabled by default**
- breaking changes in **solution configuration**:
  - parameters and parameter groups `options` moved to `additionalData`
  - **cypher queries** used in dynamic values have been **replaced by dataset part queries**
- breaking changes in dependencies:
  - migrated to **Cosmo Tech API v5**
  - migrated to **Node 24**
  - migrated to **React 19**
  - migrated to **Material-UI 7**
  - replaced Create React App by **Vite**
- breaking changes for developers:
  - replaced prefix `REACT_APP_` of all environment variables by `VITE_`
  - modified expected format of CSP in _config-overrides.js_
  - Content Security Policy is now enabled by default in dev mode

### Features

- added support for **on-premises deployment** of webapp server & function apps
- added support for **authentication with Keycloak**
- added support for embedded **Superset dashboards**
- added **Cosmo Tech API version** number in Technical Information dialog
- added **webapp build number** in Technical Information dialog

### Bug Fixes

- fixed default value of enum parameters sent to API on first launch ([741053c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/741053c9), [9a8f9fa](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9a8f9fa3))
- added missing support of defaultValue option for most varTypes of ETL parameters ([5d78a4e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5d78a4e3))
- fixed missing loading spinner and backdrop in dataset manager ([3cac407](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3cac4071))
- fixed unnecessary delay when stopping dataset creation in Dataset Manager ([1e1079a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1e1079ad))
- added missing file format validation in Dataset Manager ([0db5bba](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0db5bbaa))
- fixed Discard button sometimes not showing up after form modifications ([c63a13f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c63a13f3))
- fixed vertical alignment of loading spinner in dataset list when ETL is running ([5fe1c51](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5fe1c515))
- fixed Dataset Manager layout issues when datasets have long names ([5bbcfb9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5bbcfb9d))
- fixed possible layout issues in dataset creation dialog ([26d0284](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/26d0284a))
- fixed selection of first enum option when no defaultValue is provided ([03bb0c8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/03bb0c81))
- removed loading line of BI reducer status ([4d60f37](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4d60f37e))
- fixed PowerBI token polling when switching between workspaces ([a0c018b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a0c018b1))
- fixed polling of runner status when switching between workspaces ([14ba5e1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/14ba5e1e))
- fixed english typos ([77fd8c4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/77fd8c4b))
- fixed possible webapp error when using invalid mock data ([9451b0f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9451b0f7))

### Documentation

- updated documentation to reflect changes of API v5 and webapp v7 ([e9514ea](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e9514ea7), [a44862c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a44862ce))

## **7.0.0-beta.0** <sub><sup>2024-10-25 ([2421df6...91153cd](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/2421df66...91153cd6?diff=split))</sup></sub>

### BREAKING CHANGES

- major version change of **Cosmo Tech API from v3 to v4** (v4.0.0-onprem)
- replace scenario objects by runner objects
- rename `GetEmbedInfo` parameter `CSM_API_TOKEN_AUDIENCE` to `AZURE_COSMO_API_APPLICATION_ID`, it is now mandatory when the webapp uses Azure authentication
- remove use of dataset connector in the webapp: dataset parts now use `[dataset].source.location` to store the path of the associated workspace files

### Features

- add keycloak support for login and in `GetEmbedInfo` azure function

### Bug Fixes

- \[PROD\-12918\] ignore short network interruptions (< 30 seconds) while polling scenario state
- \[PROD\-12316\] add missing backdrop when deleting a scenario
- fix missing dataset id in refresh error translation
- improve handling of some network errors on login
- set `authLevel` of `GetEmbedInfo` to anonymous
- remove parameters `POWER_BI_WORKSPACE_ID`, `POWER_BI_AUTHORITY_URI`, `POWER_BI_SCOPE` of `GetEmbedInfo` azure function

### Documentation

- update README file of config folder
- update doc of connectorId option of file parameters
- add doc of keycloak config parameters
- update documentation of GetEmbedInfo function configuration

## **6.5.2** <sub><sup>2025-12-01 ([8d5b7d2...ae32482](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/8d5b7d22...ae324826?diff=split))</sup></sub>

### Bug Fixes

- \[PROD\-14986\] fix possible sharing issues with datasets and inherited scenarios ([27fee05](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/27fee051))
- \[PROD\-14987\] fix possible loss of access to datasets after sharing child scenarios ([1355e76](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1355e764))
- fix list of authorized MIME types, that was preventing upload of YAML files ([fd56a05](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fd56a055))
- \[PROD\-15028\] fix console warning on unexpected workspace configuration properties ([ebde14c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ebde14c6))
- fix parsing & formatting of min/max date values in Table columns ([b0313a7](https://github.com/Cosmo-Tech/webapp-component-ui/commit/b0313a7))

### Performance Improvements

- improve performance of CSV file upload in Tables

### Documentation

- add warning on timezones for date parameters ([fe7e2cc](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fe7e2cc2))

### Dependencies

- update dependencies

## **6.5.1** <sub><sup>2025-05-07 ([6244322...53eb930](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/6244322c...53eb9302?diff=split))</sup></sub>

### Bug Fixes

- fix behavior of the "stop run" button that was sometimes not using the correct run id ([82b811b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/82b811b5))
- fix missing data in graph elements inspector in the instance view (a.k.a. flowchart) ([2dc5430](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2dc54303))
- fix file download behavior that was not implemented in the dataset manager wizards ([85bcd69](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/85bcd697))
- fix dataset creation form state that was not updated correctly after reopening the dialog ([642ca3f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/642ca3f6))
- fix console warning caused by list parameters value conversion ([a039d44](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a039d447))

### Documentation

- starting with Cosmo API 3.3, scenario parameters option `dynamicValues` can no longer be used with a `defaultValue` defined ([2b4b081](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2b4b081b))

## **6.5.0** <sub><sup>2025-04-09 ([338546a...9538f69](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/338546ad...9538f699?diff=split))</sup></sub>

### Documentation

- add documentation for attributesOrder in instance view configuration ([7313523](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7313523b))
- add documentation for workspace configuration pitfalls ([f44f069](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f44f0691))

### Features

- make graph item attributes order configurable in Instance view ([c05d227](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c05d2276))
- add dialog to update ETL parameters ([e01bf1c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e01bf1c1))
- display runTemplate name in dataset metadata ([51269da](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/51269da4))
- rename datasets in dataset manager ([c45a394](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c45a3942))
- disable Launch button when dataset has status ERROR or cannot be found ([f8a5baa](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f8a5baaf))

### Bug Fixes

- add missing spinner placeholder when waiting for PowerBI access token ([7af93cb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7af93cb4))
- fix deduplication of links when name attribute is not used ([d1b0c03](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d1b0c037))
- fix graph indicators display if categories aren't defined in dataset manager config ([212567b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/212567b6))
- add console warnings to help troubleshoot workspace configuration pitfalls ([5bf33a8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5bf33a81))
- show disabled share buttons to resources viewers ([e1bdb4c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e1bdb4c9))

## **6.4.3** <sub><sup>2025-01-23 ([d0a58d7...7d4831b](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/d0a58d7f...7d4831b2?diff=split))</sup></sub>

### Bug Fixes

- fix validation of column constraints (minValue & maxValue) when importing files in a Table
- remove special characters restrictions in scenario names
- change position of the ScenarioManager tab
- fix unreachable Table component when the errors panel was displayed
- fix double scrollbar in Table components
- fix support of unicode characters in users and workspace avatars
- force uninitialized parameter values to null (improve compatibility with Cosmo Tech API >= 3.3)

## **6.4.2** <sub><sup>2024-12-12 ([5b80a98...d4a9fcc](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/5b80a98c...d4a9fcc0?diff=split))</sup></sub>

### Bug Fixes

- fix broken builds when using GitHub Actions to deploy Azure Static WebApps ([d4fefba](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d4fefba))

### Documentation

- add documentation for dataset manager overview category details

## **6.4.1** <sub><sup>2024-10-25 ([faa8584...84b8cc8](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/faa85840...84b8cc82?diff=split))</sup></sub>

### Bug Fixes

- fix resolution of axios dependency during build ([84b8cc8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/84b8cc8))

## **6.4.0** <sub><sup>2024-10-22 ([3e213b0...62dbfc9](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/3e213b08...62dbfc91?diff=split))</sup></sub>

### Features

- \[PROD\-13567\] PowerBI dashboards are now hidden when not configured ([382fec5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/382fec54))
- add support of workspace option `[workspace].solution.defaultRunTemplateDataset` ([a68a609](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a68a609b))
- \[PROD\-13559\] add external files to let projects customize translation labels ([6b6d166](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6b6d1661))
- \[PROD\-8178\] add tags and description in scenario creation dialog ([b2ff886](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b2ff886f))
- \[PROD\-8178\] display scenario tags and description in scenario manager ([6facdb4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6facdb4d))
- \[PROD\-12789\] display dataset name in scenario view ([a460a61](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a460a616))
- \[PROD\-13747\] add an option to pre-fill numeric parameter fields based on the result of a dataset query ([81bff8f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/81bff8f3))
- \[PROD\-13564\] add configurable dataset details by category (tables with content queried from the dataset) ([b269f82](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b269f829))
- support optional environment variable `REACT_APP_API_KEY` to bypass API token request ([3ee8b73](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3ee8b73e))
- add support of optional configuration to override local dev account configuration ([4c6638d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4c6638dd))

### Bug Fixes

- \[SDCOSMO\-2041\] sort workspace cards in workspace selector view ([120ab7c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/120ab7c4))
- \[PROD\-13674\] fix table not saved after a revert ([32bf0ac](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/32bf0ac0))
- fix error caused by sharing non-ETL datasets ([5ee7ffb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5ee7ffb5))
- fix escape button behavior in DescriptionEditor ([b923038](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b9230387))
- \[PROD\-13564\] improve error management in Table component ([0a1f318](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0a1f3181))
- \[PROD\-13938\] improve layout in Scenario view ([adcb4da](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/adcb4da4))
- fix infinite spinner in Enum component when target dataset doesn't exist ([203786e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/203786e9))
- \[PROD\-13351\] fix reset of previous scenario state when run start fails ([b32fd96](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b32fd96a))
- fix error handling when an error occurs during table twingraph queries ([a984b58](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a984b588))
- \[PROD\-13749\] fix placeholder label in Dashboards view when there are no scenarios ([53292b5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/53292b53))
- \[PROD\-13350\] rewrite warning message shown when deleting a dataset ([9fe83ec](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9fe83ec1))
- \[PROD\-14001\] add missing dynamic filter for scenario run id ([48730ef](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/48730eff))
- fix graph indicator height issue in Dataset Manager view ([7670136](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/76701368))
- fix typo in default message when session has expired ([0e4da04](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0e4da049))
- fix error in dataset KPIs when some query values are not used ([2e3095d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2e3095da))
- fix missing Windows\-specific MIME type for zip files ([16bfac0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/16bfac09))
- fix solution reset before landing on workspace view ([53af469](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/53af4697))
- fix possible crash when clearing the error banner ([b0269c4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b0269c42))
- fix infinite re\-render loop caused by router vs\. RHF ([9895bd4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9895bd45))
- add missing key `dynamicValues` in solution configuration schema ([3580e67](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3580e67a))
- disable storage of MSAL token in cookie ([bd5746f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bd5746f3))
- fix router & assets to allow usage of non\-root PUBLIC_URL ([6ad41ec](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6ad41ec4))
- fix missing support of PUBLIC_URL in get\-embed\-info query ([cdb8720](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cdb87208))

### Documentation

- update yarn install instructions in README ([2d3cd87](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2d3cd87c))
- add instructions to hide powerBi reports ([3e9d4ff](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3e9d4ffa))
- add example of nodes and edges queries in Table configuration ([56d5a51](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/56d5a510))
- \[PROD\-13674\] document known issue with tables sometimes not being displayed ([1ae9d8f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1ae9d8fd))
- \[PROD\-13559\] add and reorganize documentation related to project branding (component customization, translation, ...) ([95e483d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/95e483d6))
- remove obsolete section from README ([4375bc1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4375bc1b))
- update outdated configuration parameter of help menu ([d0293ab](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d0293ab0))
- \[PROD\-13747\] add documentation for dynamic numeric input ([2f55c5a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2f55c5a2))
- add more details about resultKey property in dynamic table ([7dfb7e1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7dfb7e1e))
- \[PROD\-14001\] add documentation of new dynamic filter option lastRunId ([95e3792](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/95e3792a))

## **6.3.0** <sub><sup>2024-07-12 ([abfd4f3...aa587fa](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/abfd4f35...aa587fa9?diff=split))</sup></sub>

### Features

- \[SDCOSMO\-1974\] implement scenario selector in scenario parameters ([071475b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/071475be))
- add data fetching from twingraph dataset in Table component ([05ac9eb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/05ac9eb7))

### Documentation

- add missing doc of defaultValue option in Table columns configuration ([68139dd](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/68139dd8))
- configuration of dynamic data fetching from twingraph dataset in Table component ([e87a276](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e87a276b))

## **6.2.0** <sub><sup>2024-06-21 ([578b5ad...f9cda65](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/578b5ad4...f9cda654?diff=split))</sup></sub>

### Features

- \[PROD\-13357\] add native support of twingraph datasets in instance view ([6f76e6f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6f76e6f0))
- \[SDCOSMO\-1845\] add support for **date** parameters for ETL parameters in dataset manager ([d3b4ab8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d3b4ab85))

### Bug Fixes

- don't show dataset creation button in placeholder when lacking permissions ([37430c9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/37430c98))
- fix default state of enum parameters with dynamic values in scenario parameters ([8b21105](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8b211056))
- improve error handling for parameters with dynamic values ([1d776f6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1d776f61))
- improve error handling in instance view ([2b57627](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2b576277))
- fix error in instance view if the id of a graph node is not a string ([5689191](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5689191b))
- rename data source type from `adt` (deprecated) to `azure_function` ([959abc4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/959abc40))

### Documentation

- remove line in default transformation scripts configuration ([d8447c3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d8447c3a))
- fix typos in doc of scenario parameters configuration ([54e3607](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/54e36072))
- \[SDCOSMO\-1901\] add miscellaneous doc file with dataset filter precisions ([d5534b0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d5534b0f))
- describe new data source type `twingraph_dataset` & reorganize doc ([c4b09c5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c4b09c5d))

## **6.1.0** <sub><sup>2024-04-26 ([7bfda34...77fe391](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/7bfda340...77fe3916?diff=split))</sup></sub>

### Features

- add button to let users **stop ETL runners**
- allow **logs download** when a dataset creation ETL has failed
- add **subdataset creation** feature in dataset manager
- add **dataset sharing** in dataset manager
- add new parameter input component `MultiSelect` to **select multiple values** from a list, usable for ETL parameters and scenario parameters (use `varType: 'list'`)
- add support for **dynamic enum values** (fetch available values from a dataset) in dataset manager & scenario parameters, **for both `enum` and `list` parameters**
- move most dataset action buttons in overview panel
- display dataset parent name, when defined, in metadata panel
- add option `datasourceParameterHelpers` in workspace configuration to **define default values & tooltips for native runners** (especially useful for `ADT` and `AzureStorage` parameters)
- add optional filters for datasources in workspace configuration

### Bug Fixes

- reset PowerBI themes for vanilla releases; **you may have conflicts on theme files during upgrade** if you had customized them after v6.0.0 ([106b8b4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/106b8b4c))
- fix runner logs parsing to keep only logs of main container ([f504ad0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f504ad0f))
- fix uncaught errors when a run template does not have tags defined ([0f19aea](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0f19aea9), [147f02b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/147f02b3))
- fix crash on creation when runner has no parameters ([4f2ec25](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4f2ec25f))
- in dataset creation wizard, display runTemplate name or id when labels are not defined ([362edeb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/362edeb9))
- fix webapp crash when datasetManager workspace option is an empty object ([bb0c6e2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bb0c6e2c))
- add a delay before polling start for scenario runs and twingraph creation ([81e321e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/81e321e3))
- fix default state of dataset creation wizard form ([11c7748](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/11c77486), [2f931bb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2f931bb3))
- fix allowed file types for "local file upload" native ETL ([a1841a1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a1841a18))
- reset state of the dataset creation form when removing an uploaded file ([e22ec24](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e22ec249))
- add missing tooltips on dataset manager icon buttons ([b14d982](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b14d9825))
- restore previous scenario state when its run can't be started ([c58c616](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c58c616a))
- change webapp behavior when no datasets match the workspace filter ([ec9b4ca](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ec9b4ca7))
- disable hierarchy indentation in DatasetList ([6e14a20](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6e14a204))
- prevent dataset selection when clicking on item list action buttons ([92de8b9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/92de8b95))
- fix webapp crash when parameter list contains a nullish element ([4bdc4de](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4bdc4dea))
- fix possible errors when solution arrays contain null elements ([35cdfb6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/35cdfb63))
- improve parsing of errors returned by some azure functions ([4fa794a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4fa794a8))

### Documentation

- add documentation for new features ([6553e1e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6553e1e4), [80d7eec](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/80d7eecd), [5c0f111](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5c0f1114), [7de9f54](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7de9f54a), [def99a3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/def99a34), [111b7d6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/111b7d6b), [71621d2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/71621d2b))
- update link to ScenarioDownload azure function deployment package ([07bd23e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/07bd23e5))

## **6.0.0** <sub><sup>2024-02-14 ([62d17e0...fe55837](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/62d17e0a...fe558373?diff=split))</sup></sub>

### BREAKING CHANGES

- the property `dashboard.warning` has been removed from the theme files ([c3d5cb0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c3d5cb02))
- the use of the dark-theme logo for light-theme was previously hard-coded in the `AppBar` component, the light-theme logo is now used, as expected ([4168f81](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4168f81b))

### Features

- add new optional view: dataset manager
- \[PROD\-12503\] add DatasetView ([8672a74](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8672a74))
- \[PROD\-13025\] generate dataset creation input parameters from solution config ([8adc8cb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8adc8cb))
- \[PROD\-8406\] allow translation of run templates ([79ffba6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/79ffba65))
- \[PROD\-13001\] add option to disable out of sync scenario results banner ([06591ab](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/06591ab5))
- \[PROD\-12930\] add current user permissions in organization security in redux ([7251bf5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7251bf5f))
- \[PROD\-12930\] add user permissions in datasets security in redux ([29ae855](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/29ae8556))
- \[PROD\-12917\] replace deprecated workspace config key datasetFilter by linkedDatasetIdList ([fbc2bb6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fbc2bb62))
- add `security` & `orchestratorType` keys in solution schema ([cc2659d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cc2659df))
- \[PROD\-13001\] add option to disable out of sync scenario results banner ([06591ab](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/06591ab))

### Bug Fixes

- \[PROD\-12798\] fix out\-of\-sync issue when the backend returns a startime as null ([0181a30](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/0181a302))
- \[PROD\-12786\] decouple Dashboards view from currently selected scenario ([a3ae2f7](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a3ae2f7b))
- fix CSP issue preventing exports of results from PowerBI dashboards ([ae3210d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ae3210d4))
- fix error in instance view when dataContent is null ([145f88e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/145f88e0))
- \[PROD\-12924\] redirect on workspaces selector when user has no access right to the solution ([a8cda33](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a8cda330))
- \[PROD\-12954\] set same security as scenario when creating dataset parts ([d2bb5df](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d2bb5df3))
- \[PROD\-12954\] update dataset parts security when scenario access is changed ([5273c0c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5273c0cb))
- fix background color of cards in workspace selector ([3dd9b2b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3dd9b2b7))
- replace default style of scrollbars for webkit browsers ([8423e09](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8423e090))
- change AppBar style to make it sticky ([deff93e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/deff93ea))
- remove color of warning frame around scenario results ([c3d5cb0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c3d5cb02))
- change style of AppBar when using light theme ([4168f81](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4168f81b))
- minor fixes in translations & labels ([b6a37a2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b6a37a26), [bcbdbdb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bcbdbdb7), [b404716](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b4047165), [e2d3c9b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e2d3c9b0))
- fix API endpoint used when changing the role of users in scenario sharing options ([076f9b1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/076f9b13))
- fix parsing of env var option REACT_APP_ENABLE_APPLICATION_INSIGHTS ([89d091e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/89d091e9))
- fix circular dependencies ([1d08c29](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1d08c29f))
- remove color of warning frame around scenario results ([c3d5cb0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c3d5cb0))
- change style of AppBar when using light theme ([4168f81](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4168f81))
- fill missing varTypes in parameter values when receiving scenarios ([e08995b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e08995b))

### Documentation

- add documentation of dataset manager configuration ([ede14b3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ede14b3b))
- add workspace configuration documentation ([cb4097d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cb4097da))
- improve instance view documentation ([ed25d61](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ed25d61e))
- update Storage connector requirements in docs ([60cdf78](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/60cdf789))
- add details for CSM_API_TOKEN_AUDIENCE parameter ([7af778b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7af778b4))
- add workspace configuration documentation ([cb4097d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cb4097d))
- add documentation of dataset manager configuration ([ede14b3](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ede14b3))
- \[PROD\-12475\] add queries in dataset manager documentation ([f37a9c4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f37a9c4))
- fix example of dataset manager config override ([ee6f83e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ee6f83e))
- add warning on user organization role requirement for datasets creation ([2a4d314](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2a4d314))
- add default value of canChangeRowsNumber in documentation ([b414514](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b414514))
- add PowerBI themes customization ([3a8d6c2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3a8d6c2))

## Older versions

The changelog for older versions has been removed from this file, but it is still available [here](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/v7.0.0-vanilla/CHANGELOG.md#521-2023-10-09-62b729bbd062c7).
