# Cosmo Tech Sample Webapp - Server docker image

This image uses NGINX to serve the webapp.

## Local build & run

Here are the commands to build and run a docker image for a local webapp server:

```bash
# Change directory to the root of the repository
cd azure-sample-webapp

# Build the docker image of the webapp server
docker build -t sample_webapp_server_nginx -f webapp_server_nginx/Dockerfile .

# Run the container with:
docker run --rm -it -p 3000:80 sample_webapp_server_nginx
```

The webapp should then be running locally. You can open it by browsing the following URL: `http://localhost:3000`
