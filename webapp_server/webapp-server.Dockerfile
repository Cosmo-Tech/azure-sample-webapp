# ==== Install dependencies ====

FROM cgr.dev/cosmotech/node:24-dev AS install_build_dependencies

# Setting "USER root" is required to run "corepack enable"
USER root

WORKDIR /webapp
RUN corepack enable
RUN yarn set version berry
RUN node --version
RUN yarn --version

RUN --mount=type=bind,source=package.json,target=package.json \
   --mount=type=bind,source=yarn.lock,target=yarn.lock \
   --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
   --mount=type=cache,target=/root/.yarn \
   --mount=type=cache,target=/home/runner/.yarn \
   yarn install --immutable


# ==== Build - "universal" server mode  ====

FROM install_build_dependencies AS build-universal
COPY . .
ARG VITE_BUILD_NUMBER
ENV VITE_BUILD_NUMBER=${VITE_BUILD_NUMBER}
RUN BUILD_TYPE="universal" VITE_BUILD_NUMBER="$VITE_BUILD_NUMBER" yarn buildWithVersion

# ==== Build - "specific" server mode  ====

FROM install_build_dependencies AS build-specific
COPY . .
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
ARG VITE_BUILD_NUMBER
ENV VITE_BUILD_NUMBER=${VITE_BUILD_NUMBER}
RUN PUBLIC_URL="$PUBLIC_URL" VITE_BUILD_NUMBER="$VITE_BUILD_NUMBER" yarn buildWithVersion


# ==== Serve - "universal" server mode ====

FROM cgr.dev/cosmotech/node-python-bash:24 AS server-universal
LABEL com.cosmotech.business-webapp.buildType="universal"

# Setting "USER root" is required to install serve globally
USER root

WORKDIR /webapp
ENV NODE_ENV=production
RUN npm upgrade -g npm
RUN npm install -g serve@^14.2.5

COPY --from=build-universal /webapp/build ./build
COPY --from=build-universal /webapp/scripts/patch_webapp_server ./patch_webapp_server

EXPOSE 3000
RUN chown -R node:node /webapp
RUN chmod 705 /webapp

USER node
ENTRYPOINT [ "/bin/bash" ]
CMD ["patch_webapp_server/patch_and_start_server.sh"]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1

# ==== Serve - "specific" server mode (default) ====

FROM cgr.dev/cosmotech/node-python-bash:24
LABEL com.cosmotech.business-webapp.buildType="specific"

# Setting "USER root" is required to install serve globally
USER root

WORKDIR /webapp
ENV NODE_ENV=production
RUN npm upgrade -g npm
RUN npm install -g serve@^14.2.5

COPY --from=build-specific /webapp/build ./build

EXPOSE 3000
USER node
ENTRYPOINT [ "serve" ]
CMD [ "-s", "build" ]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
