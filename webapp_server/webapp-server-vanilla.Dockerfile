# Build (this step requires "DOCKER_BUILDKIT=1" when running "docker build")

FROM node:18 AS install_build_dependencies
WORKDIR /webapp
RUN corepack enable
RUN --mount=type=bind,source=package.json,target=package.json \
   --mount=type=bind,source=yarn.lock,target=yarn.lock \
   --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
   --mount=type=cache,target=/root/.yarn \
   --mount=type=cache,target=/home/runner/.yarn \
   yarn install --immutable

FROM install_build_dependencies as build
COPY . .

RUN BUILD_TYPE="vanilla" yarn build


# Serve

FROM node:18 as server
WORKDIR /webapp
ENV NODE_ENV production

RUN npm install -g serve@^14.2.3
RUN apt-get update
RUN apt-get install -y python3

COPY --from=build /webapp/build ./build
COPY --from=build /webapp/scripts/patch_webapp_server ./patch_webapp_server

EXPOSE 3000
RUN chown -R node:node /webapp
RUN chmod 700 /webapp
USER node

CMD ["bash", "patch_webapp_server/patch_and_start_server.sh"]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
