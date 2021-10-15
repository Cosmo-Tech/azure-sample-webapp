# Azure Functions (AF)

The api folder contains all AF that will be deployed with the web application.
In this folder you'll find several files:

- package.json: if you want to add dependencies for your AF or update the existing ones
- utils folder: to centralize utility files
- AF folder (e.g. GetEmbedInfo): each folder contains specific AF files

## GetEmbedInfo

The aim of this AF is to retrieve reports information from PowerBI regarding a specific PowerBI workspace.
Once deployed, you'll need to specify several environment variables used by the AF (Azure Portal > Static Web Apps > _name_of_your_webapp_ > Configuration).
Here is the list of these environment variables:

- POWER_BI_SCOPE : "https://analysis.windows.net/powerbi/api/.default"
- POWER_BI_CLIENT_ID : the client id
- POWER_BI_WORKSPACE_ID : The Power BI workspace targeted
- POWER_BI_AUTHORITY_URI : "https://login.microsoftonline.com/common/v2.0"
- POWER_BI_CLIENT_SECRET : a client secret
- POWER_BI_TENANT_ID : the tenant id

## How to get the information for POWER_BI_WORKSPACE_ID

- Everything is available in PowerBI service URL
- You get the embedded report URL `MyReportURL`
- The values you need to use for `POWER_BI_WORKSPACE_ID` key is group part in report `MyReportURL`

_**N.B.1**_:

- Azure Portal > App Registrations > _name_of_your_app_registration_ > Overview -> displays Application (client) id and Directory (tenant) ID
- Azure Portal > App Registrations > _name_of_your_app_registration_ > Certificates & secrets > create your client secret for PowerBI

_**N.B.2**_: If you want to run the webapp locally and visualize the embedded dashboards, you need to install Azure Functions Core Tools: [instructions on this page](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

In particular, for local configuration, create a _**local.settings.json**_ file in **api** repository with the following content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "POWER_BI_SCOPE": "https://analysis.windows.net/powerbi/api/.default",
    "POWER_BI_CLIENT_ID": "<CLIENT_ID>",
    "POWER_BI_WORKSPACE_ID": "<POWER_BI_ID>",
    "POWER_BI_AUTHORITY_URI": "https://login.microsoftonline.com/common/v2.0",
    "POWER_BI_CLIENT_SECRET": "<CLIENT_SECRET>",
    "POWER_BI_TENANT_ID": "<TENANT_ID>"
  }
}
```
