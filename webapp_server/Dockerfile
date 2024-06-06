#### Build (this step requires "DOCKER_BUILDKIT=1" when running "docker build")

FROM node:18 AS dependencies
WORKDIR /webapp
RUN corepack enable
RUN --mount=type=bind,source=package.json,target=package.json \
   --mount=type=bind,source=yarn.lock,target=yarn.lock \
   --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
   --mount=type=cache,target=/root/.yarn \
   yarn install --immutable
RUN npm install -g serve@^14.2.3


FROM dependencies as build
COPY . .
ARG PUBLIC_URL
ENV PUBLIC_URL ${PUBLIC_URL}
RUN PUBLIC_URL="$PUBLIC_URL" yarn build


##### Serve

FROM build as server
ENV NODE_ENV production
USER node

COPY --from=dependencies /webapp/node_modules ./node_modules
COPY --from=dependencies /usr/local/bin/serve ./serve
COPY --from=build /webapp/build ./build

EXPOSE 3000
CMD ["serve","-s", "build"]

HEALTHCHECK --interval=60s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
