# To enable ssh & remote debugging on app service change the base image to the one below
FROM cgr.dev/cosmotech/azure-functions-node-corepack:4-node22

ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true
ENV FUNCTIONS_WORKER_RUNTIME="node"
ENV NODE_OPTIONS=--use-openssl-ca
ENV NODE_EXTRA_CA_CERTS=/tmp/cert_file

RUN corepack enable
RUN yarn set version berry
RUN node --version
RUN yarn --version

COPY . /home/site/wwwroot
WORKDIR /home/site/wwwroot

RUN if [ ! -f package.json ]; then echo 'Functions folder seems to be empty: package.json not found. Make sure you ran the image build with DOCKER_BUILDKIT=1'; exit 1; fi

RUN yarn install
