# Cosmo Tech Business Webapp

## Webapp Server

The server for the Cosmo Tech business webapp uses the [serve](https://github.com/vercel/serve) NPM package to serve a
static Single Page Application.

### Build type options

This server supports two build modes: "_specific_" (default) and "_universal_".

The "specific" mode is the most straightforward for one-shot webapp deployments (i.e. during development):

- the server is **configured at build time**
- the server will only work with a predefined URL provided in the configuration
- the generated image is self-sufficient and ready-to-use when deployed

The "universal" mode aims to build **an image that can be used for multiple webapps**:

- the server is **NOT** configured at build time
- the generated webapp package has to be **patched at run time** before starting the server
- a configuration folder must be mounted when running the container
- the generated image can be reused in multiple environments

### Local build & run

#### Server in "specific" mode

To run a local webapp server in _specific_ mode, use the commands below to build the docker image and start the
container:

```bash
# Change directory to the root of the repository
cd azure-sample-webapp

# Build the docker image of the webapp server
DOCKER_BUILDKIT=1 docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t webapp_server \
  -f webapp_server/webapp-server.Dockerfile .

# Run the container with:
docker run --rm -it -p 3000:3000 \
  --mount type=tmpfs,destination=/tmp/webapp \
  -v /absolute/path/to/custom_local_config:/webapp/patch_config \
  webapp_server
```

The webapp should then be running locally. You can open it by browsing the following URL: `http://localhost:3000`

#### Server in "universal" mode

To run a local webapp server in _universal_ mode, use the commands below to build the docker image and start the
container:

```bash
# Change directory to the root of the repository
cd azure-sample-webapp

# Build the docker image of the webapp server
DOCKER_BUILDKIT=1 docker build \
--build-arg BUILDKIT_INLINE_CACHE=1 \
--target server-universal \
-t webapp_server \
-f webapp_server/webapp-server.Dockerfile .

# Run the container with:
docker run --rm -it -p 3000:3000 \
  --mount type=tmpfs,destination=/tmp/webapp \
  -v /absolute/path/to/custom_local_config:/webapp/patch_config \
  webapp_server
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
DOCKER_BUILDKIT=1 docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t webapp_functions \
  -f ../webapp_server/webapp-functions.Dockerfile .

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
