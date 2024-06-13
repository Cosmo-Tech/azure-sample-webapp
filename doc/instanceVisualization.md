# Instance visualization

This optional view can be enabled in the webapp to visualize digital twins. This view is disabled by default, and can
be enabled by setting a valid **data source** in the workspace configuration.

Integrators must choose between two modes to use this view:
- option A: use native API features (setup is easier, but **only twingraph datasets are supported**)
- option B: deploy a custom **Azure Function** to parse the content of datasets

## Webapp configuration

### Overview

In order to enable the Instance View in your webapp, you must define the key `webApp.options.instanceView` in your
**workspace configuration file** (e.g. _Workspace.yaml_). The value of `instanceView` must be an object with two keys
`dataSource` and `dataContent`. Here is an example of a workspace YAML file defining the instance view configuration
(the expected format of objects `dataSource` and `dataContent` will be detailed in the next sections):

```yaml
key: 'mybreweryworkspace'
name: 'My Brewery Workspace'
webApp:
  url: 'https://mybreweryworkspace.example.com'
  options:
    instanceView:
      dataSource:
        type: 'azure_function'
        functionUrl: 'https://scenario-download-brewery-dev.azurewebsites.net/api/ScenarioDownload'
        functionKey: 'INSERT_FUNCTION_KEY_HERE'
      dataContent:
        compounds:
          Bar_vertex: {}
        edges:
          arc_Satisfaction:
            style: {}
            selectable: false
        nodes:
          Bar:
            style:
              shape: 'rectangle'
              background-color: '#466282'
              background-opacity: 0.2
              border-width: 0
            pannable: true
            selectable: true
            grabbable: false
          Customer:
            style:
              background-color: '#005A31'
              shape: 'ellipse'
```

### Data source

The `dataSource` object defines which strategy the webapp should use to retrieve the content of the scenarios and
datasets. It can have the following fields:

- `type`: string value defining which mode to use for data source. Possibles values are:
    - `twingraph_dataset`: the webapp will only use the Cosmo Tech API (**only supports dataset of type twingraph**)
    - `azure_function`: the webapp will use a specific Azure Function (**requires an Azure Function to be deployed**)
    - _(deprecated)_ `adt`: this value is deprecated, use `azure_function` instead
- `functionUrl`: the url of your Function App, **followed by** `/api/ScenarioDownload` (only used if `type` is `azure_function`)
- `functionKey`: the function key of your Function App; as defined in appendix A, section 2.2 (only used if `type` is `azure_function`)

Examples:

```yaml
dataSource:
  type: 'twingraph_dataset'
```

```yaml
dataSource:
  type: 'azure_function'
  functionUrl: 'https://scenario-download-mybreweryworkspace.azurewebsites.net/api/ScenarioDownload'
  functionKey: 'INSERT_FUNCTION_KEY_HERE'
```

### Data content

The `dataContent` object must describe the content you want to display, grouped by type of graph elements:
**compounds**, **edges** and **nodes**. These types are the keys of the `dataContent` object, and each of them must
contain objects as values.

For all types of graph elements, the expected format of these object values is identical:

- keys define the **names of element types in your dataset** (e.g. entity types of your model)
- values describe **style and other modifiers** to apply to this group of elements when displayed with cytoscape; these
  modifiers will be applied via a selector (c.f. the [cytoscape documentation](https://js.cytoscape.org/#style) for the
  list of possible customization options)

The example below illustrates how to use `Bar` and `Customer` entities as nodes, `arc_Satisfaction` as arcs and
`Bar_vertex` as parent relations between bars and customers:

```yaml
dataContent:
  compounds:
    Bar_vertex: {}
  edges:
    arc_Satisfaction:
      style: { 'line-color': '#999999' }
      selectable: false
  nodes:
    Bar:
      style:
        shape: 'rectangle'
        background-color: '#466282'
        background-opacity: 0.2
        border-width: 0
      pannable: true
      selectable: true
      grabbable: false
    Customer:
      style:
        background-color: '#005A31'
        shape: 'ellipse'
```

---

# Appendix A - Azure Function data source

This section explains how to properly set up some Azure resources (app registration and Function App) to read data
from your datasets, whether they are stored in ADT, Azure storage or as a twingraph.

:information_source: Note for Azure administrators: for security purposes, the enterprise application of the
Cosmo Tech API must be configured to require assignment when requesting tokens

## 1. App registration

### 1.1 Creation

For security purposes, we want to give as few permissions as possible to app registrations. This is why we will create a
new app registration for the Function App that will be created in section 2.

To create this new App Registration:

- open the [App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) page
  in the Azure Portal
- click on the _“+ New registration”_ button
  - choose the name of your Function App (you can use the pattern
    `<your_solution_name><staging_env>ScenarioDownloadFunctionApp`, e.g. _“BreweryDevScenarioDownloadFunctionApp”_)
  - leave the redirect URL section empty
  - select “Single tenant”
  - click on **Register**

### 1.2. Permissions & secrets

> **Warning**
>
> Known issue: since v2 of the Cosmo Tech API, an RBAC issue may prevent the App Registration from accessing
> the scenarios data. Two work-arounds are possible:
>
> - if it is still available in your deployed platform, you can use the v1 endpoints of the Cosmo Tech API, but it won't work with API v2.4 or above
> - otherwise, you must add the _Platform.Admin_ role to your app registration (see instructions below)

You can now open your App Registration page in the Azure portal and configure its permissions:

- open the _“API permissions”_ blade
- click on _“+ Add a permission”_
  - click on the tab _“APIs my organization uses”_
  - select _“phoenix core dev”_ (or _“phoenix core staging”_) in the list
  - select _“Application permissions”_
  - in the list of permissions, check the checkboxes for:
    - _Dataset.Reader_
    - _Scenario.Reader_
    - _Workspace.Reader_
    - _Platform.Admin_ (only necessary if using Cosmo Tech API v2 or above)
  - confirm by clicking on “**Add permissions**”
- you must now **ask an administrator to grant the permissions of your webapp**

Next, you have to create a new secret in your app registration that will be used later when configuring the Function
App:

- open the _“Certificates & secrets”_ blade
- click on _“+ New client secret“_
  - set a name for your secret (e.g. "scenario-download-[solution_name]-dev")
  - set an expiration time of 24 months
  - click on **_“Add“_** and **keep the secret value for section 2.1**

### 1.3 - Access to ADT

Your app registration must be registered as an **_“Azure Digital Twins Data Owner”_** in your
[ADT instance](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DigitalTwins%2FdigitalTwinsInstances).

- open the _“Access control (IAM)”_ blade
- click on _“+ Add”_ > _“Add role assignment“_
- select _“Azure Digital Twins Data Owner”_ and click on the _“Members”_ tab
- select _“User, group, or service principal”_
  - click on _“+ Select members”_
  - search and select the app registration that your just created for your Function App
    (e.g. _“BreweryDevScenarioDownloadFunctionApp”_)
  - click on _“Select”_
  - click on _“Review + assign“_ twice to confirm

## 2. Function App setup

The CytoViz component needs to consume instance data to display entities. This section describes how to
**set up your own Function App to read data from ADT**, but other sources of data could be used, as long as the data
format provided to the component is correct.

### 2.1 - Deployment

Unlike other Azure Functions used in the webapp that are using nodejs, this new Function App uses **python**. It means
that we cannot use the api folder of the webapp to declare this function: we have to
**create a new Function App resource in the Azure portal**. You can use
[this template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FCosmo-Tech%2Fazure-function-scenario-download%2Fmain%2Fdeploy%2Fazuredeploy.json) (documentation available
[here](https://github.com/Cosmo-Tech/azure-function-scenario-download/blob/main/docs/index.md)) to deploy a new Azure
Function with the cosmotech-azure-function-scenario-download template, and fill the requested fields.

#### Subscription

All resources in an Azure subscription are billed together.<br>
Example: _Azure MPN cosmotech.com subscription_

#### Resource group

A resource group is a collection of resources that share the same lifecycle, permissions, and policies.<br>
Example: _phoenixdev_

#### Region

Choose the Azure region that's right for you and your customers. Not every resource is available in every region.<br>
Example: _(Europe) West Europe_

#### Site name

The name of the function app. It should contain enough information to identify your function app, including:

- the goal of the Function (e.g. _“scenario-download”_)
- your solution name (e.g. _“asset”_, _“supply-chain”_)
- your customer (if any)
- your stage environment (e.g. _“dev”_, _“staging”_)

Example: _scenario-download-brewery-dev_

#### Storage account name

Name of the storage account created for the Function App.

> **Warning**
>
> Storage account name must be **between 3 and 24 characters** in length and use

**numbers and lower-case letters** only.

Example: _storagesdlbrewerydev_

#### Location

Location for all resources.<br>
Example: _[resourceGroup().location]_

#### CSM API host

The address of the Cosmo Tech API. Note that you can target a specific version of the API (provided it is available in your deployed platform) by adding its version number at the end of the URL (e.g. _"https://dev.api.cosmotech.com/v2"_).<br>
Examples:

- **dev**: https://dev.api.cosmotech.com
- **staging**: https://staging.api.cosmotech.com

> **Warning**
>
> Known issue: since v2.4 of the Cosmo Tech API, the scenarios created with v2 of the API can no longer be
> accessed from the API v1. If your webapp is configured to use v2.4 or above of the API, then make sure that your
> azure function is configured to use the same API version (at least v2).

#### Az CLI id

Client id of the app registration having access to the Cosmo Tech API.<br>
Note: Use the client id of the app registration created in section 1.1

#### Az CLI secret

Client secret of an app registration having access to the Cosmo Tech API.<br>
Note: Use the app registration secret generated in section 1.2

#### CSM API scope

The scope used to request API permissions.<br>
Examples:

- **dev**: http://dev.api.cosmotech.com/.default
- **staging**: https://staging.api.cosmotech.com/.default

#### Package address

The address of the package to be deployed (you can keep the default value).<br>

Examples:
 - for API v3: _https://github.com/Cosmo-Tech/azure-function-scenario-download/releases/download/v2.0.0/artifact.zip_
 - for API v2: _https://github.com/Cosmo-Tech/azure-function-scenario-download/releases/download/v1.0.1/artifact.zip_

You can then click on _“Review + create“_, and then on _“Create”_ after validation.

When the deployment is complete, you should get a summary of the created resources. Click on the resource of type
**_“Microsoft.Web/sites”_** to open your Function App

### 2.2 - Configuration

Now that the Function App is created, we can start its configuration:

- open the _“Functions”_ blade
  - click on the _“ScenarioDownload”_ function
  - click on _“Function keys”_
  - click on _“+ New function key”_
    - enter the name of your webapp as the name of this function key (e.g. _azure-sample-webapp_)
    - leave the value empty for the key to be automatically generated
    - click on _“OK”_
    - **copy the function key value** (with the name you have just set) and use it in the workspace configuration, for
      the value of `dataSource.functionKey`
- open the _“Authentication”_ blade
  - click on “Add identity provider“
    - Select the Identity Provider: _“Microsoft”_
    - Select _“Pick an existing app registration in this directory”_
    - Pick **the App Registration of your webapp** (**NOT** the one you created in section 1.1)
    - select _“Require authentication”_ if it’s not already selected
    - redirect unauthenticated requests to _“HTTP 401 Unauthorized: recommended for APIs”_
    - check the _“Token store”_ checkbox
  - **click on _“Add”_ to save your changes**
  - in the line that has been added for the _“Microsoft”_ identity provider, click on the _“Edit”_ icon
  - in the list of _“Allowed token audiences”_, add a new authorized value _“http://dev.api.cosmotech.com“_ and **click
    on _“Save”_**
- open the _“Application Insights”_ blade (if you want to enable Application Insights for your Function App)
  - click on _“Turn on Application Insights“_
  - if you already have an App Insights instance, click on _“Select existing resource”_ and select your instance
  - if you don’t already have an App Insights instance, create a new resource:
    - use an existing _“Log Analytics Workspace”_ (e.g. _“phoenixdev-loganalytics-worskpace”_) or create a new one
  - **click on _“Apply”_ and confirm**
- open the _“CORS”_ blade
  - check _“Enable Access-Control-Allow-Credentials”_ the checkbox
  - add the values below in _“Allowed Origins”_:
    - _https://portal.azure.com_
    - _http://localhost:3000_
    - < your deployed webapp URL > (e.g. _“https://sample.app.cosmotech.com”_)
  - **click on _“Save”_ to save your changes**

# Appendix B - Troubleshooting

## Overriding the workspace configuration

Updating the workspace configuration via the Cosmo Tech API (with restish or swagger) can be a slow, cumbersome and
error-prone process. A simpler way to iterate on the instance view configuration during development is to use the file
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js). This file can be used to override the
configuration of any workspace, by patching the workspace data sent by the Cosmo Tech API.

Open the file and modify the `WORKSPACES` constant, that contains an array of workspace objects. These objects must
contain an `id` property, that will be used to patch the matching workspace sent by the API.

Here is an example of how to override the `instanceView` configuration via the
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js) file:

```js
export const WORKSPACES = [
  {
    id: 'w-000000000', // replace this id by your workspace id
    webApp: {
      options: {
        instanceView: {
          dataSource: {
            type: 'adt',
            functionUrl: 'https://scenario-download-brewery-dev.azurewebsites.net/api/ScenarioDownload',
            functionKey: 'INSERT_FUNCTION_KEY_HERE',
          },
          dataContent: {
            compounds: { Bar_vertex: {} },
            edges: { arc_Satisfaction: { style: {}, selectable: false } },
            nodes: {
              Bar: {
                style: {
                  shape: 'rectangle',
                  'background-color': '#466282',
                  'background-opacity': 0.2,
                  'border-width': 0,
                },
                pannable: true,
                selectable: true,
                grabbable: false,
              },
              Customer: { style: { 'background-color': '#005A31', shape: 'ellipse' } },
            },
          },
        },
      },
    },
  },
];
```

This configuration will then be used when **running your webapp locally** and quickly iterate on the configuration to
find the
best styles and options for your instance visualization. You can even commit these changes in your webapp repository to
keep using this "configuration patch" in **deployed webapps** (it can be useful for feature preview environments).

## Use a local Function App

For dev and debugging purposes, you may want to run the Function App locally. In order to do it, clone the repository of
the azure function from GitHub:

```bash
git clone https://github.com/Cosmo-Tech/azure-function-scenario-download.git
cd azure-function-scenario-download
```

Then, create a file _local.settings.json_ for the configuration of the local azure function:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AZURE_CLIENT_ID": "INSERT_APP_REGISTRATION_CLIENT_ID_HERE",
    "AZURE_CLIENT_SECRET": "INSERT_APP_REGISTRATION_SECRET_HERE",
    "AZURE_TENANT_ID": "INSERT_AZURE_TENANT_ID_HERE",
    "COSMOTECH_API_HOST": "https://dev.api.cosmotech.com",
    "COSMOTECH_API_SCOPE": "http://dev.api.cosmotech.com/.default"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}
```

Note:
_don’t forget to change values for `COSMOTECH_API_HOST` and `COSMOTECH_API_SCOPE` if you are using the staging API or a
custom API deployed for your organization._

Finally, install the dependencies and run the function:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
func start
```

Your local Azure Function should now be running, but you still have to change the `dataSource` value in the workspace
configuration to set:

```
functionUrl: 'http://localhost:7071/api/ScenarioDownload',
```

Note that you can use the file [src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js) to override the Workspace configuration and switch temporarily the `functionUrl` value (see section "Overriding the workspace configuration" above).

## Getting the error logs of your deployed Function App

You can access the logs of your Function App from Application Insights, or from the list of functions in your Function
App:

- find your [Function App](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp)
  in the Azure portal
- open the _“Functions”_ blade
- click on the _“ScenarioDownload”_ function
- open the _“Monitor”_ blade
  - **all recent errors will be displayed in the _“Invocations”_ tab**: click on an error to get the function logs

## Common errors & how to fix them

### 401 Unauthorized

Check the function **URL**, function **key** in your workspace configuration, and the **client secret** in the azure
function configuration.

### Audience validation failed

If you encounter the following error:

> IDX10214: Audience validation failed.
>
> Audiences: [...]
>
> Did not match: validationParameters.ValidAudience: [...]

then you may need to change the list of allowed audiences in the Authentication panel of your Function App (refer to section 2.2 “Configuration“ of Appendix A).

### 500 Internal server error

Check the error log in your Function App to get more information on the error.

If the error message is **_“Access is denied”_**:

- check that your app registration has the permissions `Dataset.Reader`, `Scenario.Reader` and `Workspace.Reader`
- check that these permissions have been granted by an administrator

If the error message complains about a **scenario not found**:

- check that your Azure Function is configured to use at least v2 of the Cosmo Tech API (see configuration of "CSM API host" above)

If the error message is **_“authentication.token.tok…ization.mailJwtClaim [...] must not be null”_**:

- check that your Azure Function is configured with the _Platform.Admin_ role (see section "Permissions & secrets" above, in the app registration configuration)

### Network error

- check the Function App URL in the front-end configuration file
- if you are using a local azure function, check that it is running and that the local port is correct

# Maintenance

## How to update your Function App

You can redeploy the Function App with a newer version by changing the parameter `WEBSITE_RUN_FROM_PACKAGE`
in the "_Configuration_" blade of your Function App page, in the Azure portal.

Example:

```
Name: WEBSITE_RUN_FROM_PACKAGE
Value: https://github.com/Cosmo-Tech/azure-function-scenario-download/releases/download/v2.0.0/artifact.zip
```

Click on "OK" to change the value of the parameter, and then on "**Save**" to confirm your changes and trigger the Function App update.
