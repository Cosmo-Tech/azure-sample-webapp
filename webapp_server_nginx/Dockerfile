#### Build

FROM node:18 AS build_webapp
WORKDIR /webapp
COPY . .
RUN yarn install && yarn build

##### Serve

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
COPY --from=build_webapp /webapp/build .
COPY webapp_server_nginx/nginx.conf /etc/nginx/nginx.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
