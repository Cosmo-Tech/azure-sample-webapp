# ==== Install dependencies ====

FROM node:24-slim AS install_build_dependencies

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

FROM install_build_dependencies as build-universal
COPY . .
RUN BUILD_TYPE="universal" yarn build

# ==== Build - "specific" server mode  ====

FROM install_build_dependencies as build-specific
COPY . .
ARG PUBLIC_URL
ENV PUBLIC_URL ${PUBLIC_URL}
RUN PUBLIC_URL="$PUBLIC_URL" yarn build


# ==== Serve - "universal" server mode ====

FROM node:24-slim as server-universal
LABEL com.cosmotech.business-webapp.buildType="universal"

RUN apt-get update
RUN apt-get install -y python3
# Remove Yarn v1
RUN rm /usr/local/bin/yarn*
RUN rm -rf /opt/yarn-v1.22.22

WORKDIR /webapp
ENV NODE_ENV production
RUN npm install -g serve@^14.2.5

COPY --from=build-universal /webapp/build ./build
COPY --from=build-universal /webapp/scripts/patch_webapp_server ./patch_webapp_server

EXPOSE 3000
RUN chown -R node:node /webapp
RUN chmod 700 /webapp
USER node
CMD ["bash", "patch_webapp_server/patch_and_start_server.sh"]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1

# ==== Serve - "specific" server mode (default) ====

FROM node:24-slim as server-specific
LABEL com.cosmotech.business-webapp.buildType="specific"

# Remove Yarn v1
RUN rm /usr/local/bin/yarn*
RUN rm -rf /opt/yarn-v1.22.22

WORKDIR /webapp
ENV NODE_ENV production
RUN npm install -g serve@^14.2.5

COPY --from=build-specific /webapp/build ./build

EXPOSE 3000
USER node
CMD ["serve","-s", "build"]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
