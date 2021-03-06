# Azure Functions (AF)

The api folder contains all AF that will be deployed with the web application.
In this folder you'll find several files:
- package.json: if you want to add dependencies for your AF or update the existing ones
- utils folder: to centralize utility files
- AF folder (e.g. GetEmbedInfo): each folder contains specific AF files

## GetEmbedInfo

The aim of this AF is to retrieve reports information from PowerBI regarding a specific PowerBI workspace.
Once deployed, you'll need to specify several environment variables used by the AF.
Here is the list of these environment variables:
- POWER_BI_SCOPE : "https://analysis.windows.net/powerbi/api"
- POWER_BI_CLIENT_ID : the client id
- POWER_BI_WORKSPACE_ID : The Power BI workspace targeted
- POWER_BI_AUTHORITY_URI : "https://login.microsoftonline.com/common/v2.0"
- POWER_BI_CLIENT_SECRET : a client secret 
- POWER_BI_TENANT_ID : the tenant id

_**N.B**_: If you want to deal with AF locally, you can follow this [page]("https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Ccsharp%2Cbash")
 For local configuration, create a _**local.settings.json**_ file in **api** repository with the following content:

```json
{
"IsEncrypted": false,
    "Values": {
    "POWER_BI_SCOPE": "https://analysis.windows.net/powerbi/api",
    "POWER_BI_CLIENT_ID": "<CLIENT_ID>",
    "POWER_BI_WORKSPACE_ID": "<POWER_BI_ID>",
    "POWER_BI_AUTHORITY_URI": "https://login.microsoftonline.com/common/v2.0",
    "POWER_BI_CLIENT_SECRET": "<CLIENT_SECRET>",
    "POWER_BI_TENANT_ID": "<TENANT_ID>"
    }
}
```
Don't forget to adapt the content of the local.settings.json file regarding your needs.

