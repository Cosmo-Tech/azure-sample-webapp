# To enable ssh & remote debugging on app service change the base image to the one below
FROM mcr.microsoft.com/azure-functions/node:4-node18

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true
ENV FUNCTIONS_WORKER_RUNTIME="node"
ENV NODE_OPTIONS=--use-openssl-ca

RUN corepack enable

COPY . /home/site/wwwroot
WORKDIR /home/site/wwwroot

RUN if [ ! -f package.json ]; then echo 'Functions folder seems to be empty: package.json not found. Make sure you ran the image build with DOCKER_BUILDKIT=1'; exit 1; fi

RUN yarn install

# Uncomment the lines below & change authLevel in api/<function_folder>/function.json to enable the function key
# ENV AzureWebJobsSecretStorageType=files
# RUN mkdir secrets
# ENV FUNCTIONS_SECRETS_PATH=secrets
# RUN echo '{"masterKey":{"name":"master","value":"<insert_secret_master_key_here>","encrypted":false},"functionKeys":[]}' > secrets/host.json


# The env vars below will be loaded from kubernetes secrets
# KEYCLOAK_REALM_URL
# POWER_BI_TENANT_ID
# POWER_BI_CLIENT_ID
# POWER_BI_CLIENT_SECRET
