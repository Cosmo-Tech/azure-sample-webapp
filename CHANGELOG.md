## **6.3.1** <sub><sup>2024-07-23 ([4c4f99a...5ed3123](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/4c4f99a1...5ed31234?diff=split))</sup></sub>

### Bug Fixes
*  \[PROD\-13674\] save the dynamic table after a revert ([128079d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/128079df))
*  fix solution reset before landing on workspace view ([5ed3123](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5ed31234))
* [SDCOSMO-1886] fix behavior of dynamic filters when selection list is empty ([1d3c5eb](https://github.com/Cosmo-Tech/webapp-component-azure/commit/1d3c5eb))

### Documentation
*  add example of nodes and edges queries in Table configuration ([9b0a134](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9b0a1347))
*  \[PROD\-13674\] add not displayed table behavior as Known Issue ([ada56dd](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ada56ddd))


## **6.3.0** <sub><sup>2024-07-12 ([abfd4f3...aa587fa](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/abfd4f35...aa587fa9?diff=split))</sup></sub>

### Features
*  \[SDCOSMO\-1974\] implement scenario selector in scenario parameters ([071475b](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/071475be))
*  add data fetching from twingraph dataset in Table component ([05ac9eb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/05ac9eb7))

### Documentation
*  add missing doc of defaultValue option in Table columns configuration ([68139dd](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/68139dd8))
*  configuration of dynamic data fetching from twingraph dataset in Table component ([e87a276](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/e87a276b))

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

## **5.2.1** <sub><sup>2023-10-09 ([62b729b...bd062c7](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/62b729b9...bd062c70?diff=split))</sup></sub>

### Bug Fixes

- fix error preventing login with Azure

## **5.2.0** <sub><sup>2023-10-06 ([238b554...e8fa794](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/238b5547...e8fa794a?diff=split))</sup></sub>

### Features

- improve **user input validation** for scenario parameters:
  - type-checking
  - required fields
  - min/max length or values
  - list of allowed file extensions
  - comparison with other scenario parameters (e.g. _start date < end date_)
  - **error badges** added to point out tabs with validation errors
- improvements for **table** scenario parameters
  - add **fullscreen** support for an improved user experience when working with tables
  - when option `canChangeRowsNumber` is set, users will be able to manually **create and delete rows** in the table
  - add support for **groups of columns**, with optional columns "collapse & expand"
- improve checks & error messages to help integrators:
  - show warnings in console when solution contains unrecognized keys
  - show warnings in console when workspace contains unrecognized keys
  - improved error messages context & format for PowerBI service account errors
- more context shown to end-users:
  - modify workspace selector button ("home" button) to make workspace information visible from scenario view
  - scenario run types are now visible from scenario manager
  - the technical details of the solution are shown in the "Help" menu
  - simulation logs can now be downloaded even when scenario runs have succeeded
- and more new features:
  - when option `shouldRenameFileOnUpload` is set for files or tables parameters, uploaded files are renamed before being saved
  - add optional tooltips to describe values of "enum" scenario parameters
  - add translation support for enum values

### Bug Fixes

- force date values received from \(and sent to\) back\-end to be set to midnight UTC ([987f1cf](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/987f1cfb))
- rename \.xlsx files imported in Table to \.csv before upload ([5e75dfc](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5e75dfc0))
- prevent aggrid from automatically renaming table columns ([9fcb439](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9fcb4390))
- make email & roles non\-case\-sensitive ([25ececb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/25ececbd))
- make running state more visible ([d07c6bc](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d07c6bcd))
- slightly increase size of run template name in Scenario view ([1c18af0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1c18af02))
- add parent-child indentation in scenario dropdown list, in scenario creation pop-up ([9d23168](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9d231682))
- fix errors message mentioning "scenario run" when the "Save" action failed ([8efa3da](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/8efa3da6))
- disable folding of organization Accordion in workspaces selector ([834f557](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/834f5576))
- running scenarios are now stopped before being deleted ([2bae6fc](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2bae6fc0))
- show error in browser console when conversions of parameter values have failed ([08ff30f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/08ff30f0))
- fix possible errors in Powerbi reducer & saga ([fcd1929](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fcd1929d))
- fix broken behavior of REACT_APP_NO_POWERBI_POLLING option ([be87a09](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/be87a093))
- and more minor bug fixes...

### Known issues

- clearing the errors panel of a Table parameter does not reset the "dirty" state of the scenario parameters form
- when using **chrome**-based browsers, for parameters of type `date`, depending on the user location and browser settings, some old dates and timezones may be misinterpreted: when saving the scenario, a date might be replaced by the previous day instead (e.g. dates before March 11, 1911, in France)

### Documentation

- describe validation configuration for scenario parameters ([d258e6c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d258e6c1))
- add docs to explain solution and workspace schema validation ([5955678](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5955678f))
- add documentation for `hidden` option of parameters & groups ([5439b48](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5439b484))
- add documentation of new option `columnGroupShow` for table parameters ([799b9a4](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/799b9a46))
- add documentation of new option `shouldRenameFileOnUpload` for files & tables parameters ([4d16789](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4d16789f))
- add instructions for webapp security when using custom API URL ([ec4e678](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ec4e678a))
- minor changes ([ecaf248](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ecaf248a), [1b15290](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1b15290a), [db0bb2e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/db0bb2e3))

## **5.1.1** <sub><sup>2023-09-07 ([8f66c56...8f66c56](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/8f66c56f...8f66c56f?diff=split))</sup></sub>

### Bug Fixes

- fix float numbers input when using FR locale

## **5.1.0** <sub><sup>2023-05-25 ([82dd6c3...88f3871](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/82dd6c37...88f3871d?diff=split))</sup></sub>

### Features

- allow users to save modified scenario parameters without launching a scenario run
- allow users to abort a running scenario
- add visual indicators in scenario parameters panel to identify fields that have been changed since last save
- add visual indication around PowerBI charts when the visible results may not be up-to-date with the current scenario parameters
- add confirmation pop-ups for some actions that can lead to loss of unsaved changes on scenario parameters (e.g. closing the window, switching to another tab in the webapp)
- in the Scenario view, the PowerBI dashboards panel can now be folded to save some space
- migrating node version from v14 to v16 for local development

### Bug Fixes

- allow usage of different PowerBI workspaces in the webapp workspaces ([7c9927e](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7c9927e4), [d291812](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d2918127))
- stop polling scenario status on workspace change ([b26aa59](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b26aa590))
- add token validation in GetEmbedInfo azure function ([4ef6678](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4ef66781), [86d1229](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/86d12297), [b6f5860](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b6f5860b))
- fix error banner's animation, handle error properly ([859a4e8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/859a4e82))
- prevent null or NaN values in number input fields ([1c40ae1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1c40ae1f))
- fix console warning regarding undefined required prop ([2c4330d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/2c4330de))
- explicitly set scenario security on creation ([a21adbb](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a21adbb7))
- store data of new last run immediately when launching a new run ([15b9bd6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/15b9bd68))

### Documentation

- add documentation for new optional parameter of GetEmbedInfo azure function ([413ae44](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/413ae445))
- add migration guide for v5\.0\.0 ([44b55b2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/44b55b2c))
- add doc for v5.0.0 migration script ([6e81a97](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6e81a97f))
- update documentation to reflect configuration changes of last major version v5.0.0 ([d211cf2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d211cf2e))
- update the documentation relative to themes customization ([1fad689](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1fad6894))
- update upstream definition commands in README file ([9ac46f1](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/9ac46f12))
- update instructions to run the webapp locally ([1338da2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/1338da2e))
- add warnings related to API v2 and v2\.4 in instance view documentation ([c3333d0](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c3333d0b))
- remove link to deleted doc file ([4167da5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/4167da5a))

### Known issue

- renaming, validating or rejecting a scenario will trigger the "not up-to-date" warning indicator around the PowerBI charts

## **5.0.1** <sub><sup>2023-03-21 ([f366bc0...cad52a7](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/f366bc0d...cad52a73?diff=split))</sup></sub>

### Bug Fixes

- fix "digital twin" view tab always visible in the application top bar, and related router issues

### Dependencies

- upgrade webpack to 5.76.2

## **5.0.0** <sub><sup>2023-03-02 ([bdf506e...c5f01cb](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/bdf506e0...c5f01cba?diff=split))</sup></sub>

### Features

- add **workspace selector** screen: a single webapp can now be used to browse multiple workspaces
- add option to add descriptive tooltips in scenario parameters
- add new input components: sliders & radio buttons
- improve the layout of scenario parameters input fields
- add dynamic filter for PowerBI reports containing the list of scenarios visible by the current user
- add navigation by workspace id in the webapp URL
- add a migration script to help migrating a webapp from v4.x to v5.0.0
- add export to XLSX in Table scenario parameters
- add a `datasetList` option in workspace to filter the datasets displayed when creating a scenario
- add workspaces filter in global configuration
- allow parameters & groups configuration from Solution data
- allow overriding of Solutions & Workspaces from the webapp source code
- add an option to hide scenario parameters
- improve formatting of json files generated by the migration script
- during the webapp build, environment variables can now be used to override webapp configuration files
- automatically fill and send extra/hidden parameters (e.g. scenario name, scenario id, ...), no more options to configure
- generate `data-cy` of scenario parameters inputs automatically
- add support of new scenario run state `DataIngestionInProgress`
- add an error boundary around embedded PowerBI dashboards to prevent some webapp crashes
- add UserStatusGate component

### Bug Fixes

- fix scenarios list sorting when none of the root scenarios are found
- set a limit to the number of errors than can be shown when a table import has failed, preventing some webapp freezes
- cast scenario parameters min, max & default values from solution data
- fix get\-embed\-info azure function that was requesting access to all reports in PowrBi workspaces when asking for a PowerBI token
- fix layout issues in Dashboards view
- fix error when downloading a file that has just been uploaded
- add error banner to display errors when a file upload has failed in editable tables
- change button and title labels in read\-only scenario sharing dialog
- fix some styles & colors
- fix infinite run when a scenario is in state Unknown
- fix webapp behavior on missing dashboards configuration
- fix setting of env var APP_VERSION in package scripts

### Performance Improvements

- improve performance in scenario manager view

### BREAKING CHANGES

- dependency material-ui migrated from v4 to v5
- data structure of configuration files has changed, please refer to the v5 migration guide for more details
- configuration files in src/config are now JSON files instead of JS files
- drop support of scenario parameters **as functions**, see migration guide of v3.0.0 to see how to replace them by **React components**
- when using an azure function to retrieve the Instance view data, you must now add the URL of this azure function in the `connect-src` field, in file _config-overrides.js_
- options in file _src/config/ScenarioParameters\.js_ for extra scenario parameters are no longer used (e.g. ADD_SCENARIO_NAME_PARAMETER, ADD_SCENARIO_ID_PARAMETER, ...; instead, the webapp will automatically generate the values and send them if a corresponding parameter id has been declared in the solution
- environment variable that was previously available as `REACT_APP_VERSION` will now be available as `REACT_APP_APP_VERSION`,to be consistent with the `APP_VERSION` parameter in the HelpMenu configuration file
- key 'dataCy' is no longer used in scenario parameters configuration

## **4.0.0** <sub><sup>2022-11-10 ([6caa521...0b8e33c](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/6caa521b...0b8e33ca?diff=split))</sup></sub>

### Documentation

- add section to document how to update a Function App

### Features

- add scenario sharing feature & enforce RBAC/ACL security in webapp
- add distinct styles for in & out edges in digital twin visualization
- improve layout & style in Scenario view
- add tooltips when using icon buttons

### Bug Fixes

- fix style of "Sign out" button in AccessDenied
- fix z\-index of backdrop shown during scenario creation
- restore missing backdrop when switching between scenarios
- fix stuck loading screen on unknown scenario
- fix scenario view layout when no scenarios exist
- fix console warning about undefined scenarioId on scenario creation
- fix console warning about Tooltip around disabled button
- remove loading spinner stuck after 'wrong scenario URL' redirection
- print errors details in browser console when the default error message is displayed on login
- fix detection of connected React components in tabs wrapper
- fix wrong propType in ScenarioParametersTab component & remove unused prop
- fix crash related to undefined value reading after react\-router\-dom dependency update
- secure table load on scenario change
- format parameters values in redux scenarios list on reception
- prevent undesired rerenders of scenario creation dialog
- prevent re-rendering of the whole application on powerbi errors
- fix scenarios sort function to include scenarios whose parent is not found
- rename 'instance' view tab to 'digital twin'

### BREAKING CHANGES

- profiles permissions mapping previously defined in src/config/Profiles\.js is no longer supported, the back\-end now enforces permissions based on user profiles
- the list of existing APP_ROLES has been moved to services/config/accessControl/Profiles\.js

## **3.0.0** <sub><sup>2022-08-16</sup></sub>

### Features

- dark/light theme switch
- scenarios ids are now included in URLs to let users share direct links to a specific scenario
- migration script to migrate configuration folder to v3.0.0 format

### Bug Fixes

- after login, users are now properly redirected to the view given in the URL they tried to access
- fix possible error after login pop-up with some browsers
- fix error during authentication if profiles and permissions are empty in configuration files

### BREAKING CHANGES

_Note: a [migration guide](./doc/migrationGuides/v3.0.0.md) is available to help you migrate your solution to v3.0.0_

- files in the webapp configuration folder have been reorganized
- new theme structure:
  - theme is dynamic and has to be imported from Redux from now on
  - removed some material-ui overrides in palette.js
  - removed custom theme variables in palette.js
  - removed 'default' theme folder
- username removed from top bar
- react-router upgraded to v6 (PrivateRoute and PublicRoute components have been removed)
- generic factories (for scenario parameters inputs and tabs) transformed from functions to React components: "function-shaped" factories are still supported but are now considered deprecated, please update your factories to React components (see migration guide for further instructions)
- the redirection URL was changed from /scenario to /sign-in: you must update the accepted redirection URLs in the Azure portal page of your App Registration and replace /scenario by /sign-in (or only add /sign-in to keep supporting previous versions of your webapps)

## **2.8.0** <sub><sup>2022-08-09 ([c56ce5d...f7452e2](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/c56ce5d...f7452e2?diff=split))</sup></sub>

### Features

- allow **run-type-based scenario reports** ([b2e3bc9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b2e3bc94))
- new view for **ADT instance visualization** ([3993934](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/39939346))
- add **scenario renaming** in scenario manager ([ab1df5c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/ab1df5c9))

### Bug Fixes

- fix unnecessary state refresh of table components ([00cc9b8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/00cc9b89))
- fix english mistakes in labels ([5085848](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/50858482))
- remove loading message before loading ([641d1d7](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/641d1d77))
- add unknown state placeholder ([91feb14](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/91feb144))
- fix crash in Dashboards view when a scenario with 'Unknown' status is selected ([193cf05](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/193cf05c))

### Documentation

- update dashboards documentation ([cb22cad](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cb22cad1))
- fix broken link in documentation ([329772f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/329772fb))

## **2.7.2** <sub><sup>2022-06-15 ([f86ac6d...f86ac6d](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/f86ac6d...f86ac6d?diff=split))</sup></sub>

### Bug Fixes

- fix CSP\-related issue preventing token refresh ([f86ac6d](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f86ac6d))

## **2.7.1** <sub><sup>2022-06-09 ([d98bc0f...14c95c6](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/d98bc0f...14c95c6?diff=split))</sup></sub>

### Bug Fixes

- fix CSP errors ([14c95c6](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/14c95c6))

## **2.7.0** <sub><sup>2022-06-08 ([31d11a9...33aa147](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/31d11a9...33aa147?diff=split))</sup></sub>

### Features

- add session timeout ([d7e7a8a](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d7e7a8a))
- allow dot in scenario names ([37f4b1c](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/37f4b1c))
- add Content Security Policy and other security-related HTTP headers ([33aa147](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/33aa147))

### Bug Fixes

- improve errors handling during API requests ([eedc283](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/eedc283))
- improve errors handling on sign-in page ([99f9e83](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/99f9e83))
- disable insecure app insights cookies 'ai_session' and 'ai_user' ([d9314ec](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/d9314ec))
- fix warning in Azure Function ([7a7f4e2](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/7a7f4e2))

## **2.6.1** <sub><sup>2022-05-16 ([5f97a59...5bc6879](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/5f97a59...5bc6879?diff=split))</sup></sub>

### Bug Fixes

- fix app crash when no scenarios exist ([dcf9cc5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/dcf9cc5))
- change PermissionGate children prop type from object to node ([01b1540](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/01b1540))
- add & use new permission canChangeScenarioValidationStatus for validation status edition ([5bc6879](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/5bc6879))

## **2.6.0** <sub><sup>2022-05-11 ([8bf8666...196e124](https://github.com/Cosmo-Tech/azure-sample-webapp/compare/8bf8666...196e124?diff=split))</sup></sub>

### Documentation

- update doc ([c87bdc9](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/c87bdc9))
- add doc for iframe ratio configuration ([cb4cbba](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cb4cbba))
- Documentation for Azure custom metrics ([3ccd690](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/3ccd690))
- Fix broken link in doc for custom metrics ([cea8ad8](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/cea8ad8))
- add note to fix possible AppInsights activation error message ([a177318](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/a177318))
- fix formatting in doc file and remove emoji that breaks formatting ([dd5f95f](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/dd5f95f))
- update Upload section in Custom metrics ([6eafd69](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/6eafd69))

### Features

- add DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO parameter in webapp config ([f264aa5](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f264aa5))
- add scenario validation status in scenario & scenario manager views ([91f7678](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/91f7678))
- support empty fields in table component ([bf87591](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bf87591))

### Bug Fixes

- fix AzureFunction error on missing config ([b58fa48](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/b58fa48))
- fix Azure Function syntax error ([f0782fa](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/f0782fa))
- change success color value in theme ([fd0feaf](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/fd0feaf))
- trigger upload file event in app insights ([885ce50](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/885ce50))

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
- fix scenario state not updated in scenarios list when running ([bc5c182](https://github.com/Cosmo-Tech/azure-sample-webapp/commit/bc5c182))

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
