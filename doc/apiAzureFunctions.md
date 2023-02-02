# API folder - Azure Functions

The ["api" folder](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/api) contains all **Azure Functions**
that will be deployed with the web application. In this folder you'll find several files:

- package.json: if you want to add dependencies for your AF or update the existing ones
- utils folder: to centralize utility files
- Azure Functions: one folder must be created for each Azure Function (e.g. **GetEmbedInfo**)

## GetEmbedInfo

This Azure Function is only necessary when using the **service account** mode to access PowerBI reports. If your webapp
is configured to use the connected user identity, then you do not need to use this Azure Function. See the
[PowerBI configuration](powerBI.md) documentation for more details.
