# Cosmo Tech Business Webapp

## Webapp Server

This image uses [serve](https://github.com/vercel/serve) to serve a static Single Page Application.

### Local build & run

To build and run a docker image for a local webapp server, use the commands below:

```bash
# Change directory to the root of the repository
cd azure-sample-webapp

# Build the docker image of the webapp server
DOCKER_BUILDKIT=1 docker build -t webapp_server -f webapp_server/webapp-server.Dockerfile .

# Run the container with:
docker run --rm -it -p 3000:3000 webapp_server
```

The webapp should then be running locally. You can open it by browsing the following URL: `http://localhost:3000`

## Webapp Functions

Depending on how you want to use some features of the Cosmo Tech Business Webapp, you may have to deploy Functions next
to the webapp server.

This image uses
[Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=linux%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-javascript)
with a Node.js runtime to provide custom API endpoints used by the Cosmo Tech Business Webapp.

### Local build & run

You can use these commands to build the webapp functions container:

```bash
# Change directory to the api folder
cd azure-sample-webapp/api

# Build the docker image of the webapp Functions server
DOCKER_BUILDKIT=1 docker build -t webapp_functions -f ../webapp_server/webapp-functions.Dockerfile .
```

Then, create a `.env` file to store the environment variables required by the functions, and adapt the values below:

```
POWER_BI_TENANT_ID=01234567-8901-abcd-1234-012345678901
POWER_BI_CLIENT_ID=01234567-8901-abcd-1234-012345678901
POWER_BI_CLIENT_SECRET=generated_client_secret
KEYCLOAK_REALM=https://example.com/keycloak/realms/myrealm
```

Finally, use this command to build and run the functions locally:

```
docker run --env-file .env --rm -it -p 7071:80 webapp_functions
```

The Functions should then be running locally. Press Ctrl+C to stop the container.
