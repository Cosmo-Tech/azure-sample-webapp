# Azure Sample Webapp - Migration scripts

This folder contains **migration scripts** to help users migrate between major versions of the _Azure Sample Webapp_.
These scripts can not guarantee a full coverage of the manual operations required when switching to a new major version,
but they can automate some parts of the migration.

| :exclamation: Before running these scripts, please make sure you don't have uncommitted local changes in your webapp project. |
| ----------------------------------------------------------------------------------------------------------------------------- |

This migration script requires **Node 16** or above to run. If you don't already have this version, you can install it
with:

```
nvm install 16
nvm use 16
```

# Supported versions

## Migrate from v2 to v3

`npx @cosmotech/migrate-azure-sample-webapp@latest v3`

## Migrate from v4 to v5

`npx @cosmotech/migrate-azure-sample-webapp@latest v5 [-s path/to/your/solution.yaml] [-w path/to/your/workspace.yaml]`

Optional parameters:

- `-s/--solution`: provide the path to an existing YAML solution description file to merge its content with your webapp
  configuration file src/config/ScenarioParameters.js and write the result in a new YAML file
- `-w/--workspace`: provide the path to an existing YAML workspace description file to merge its content with your
  webapp configuration file src/config/PowerBI.js and write the result in a new YAML file

# Dev notes

## Run migration scripts from a local repository

- `cd` to the folder containing the migration scripts (with files `migrate.js` and `package.json`) and run `npm link`
- `cd` to the folder where you want to run the migration scripts, and run `migrate-azure-sample-webapp v5`

## Release a new version of the migration script

For an official release:

```sh
npm version X.X.X --no-git-tag-version  # Replace X.X.X by the new version number
git add package.json
git commit -m "chore: bump migration script package version to X.X.X for release"  # Replace X.X.X here too
npm login
npm publish
```

For a non-official "dev" release:

```sh
npm version X.X.X-dev.X --no-git-tag-version  # Replace X.X.X-dev.X by the new version number
git add package.json
git commit -m "chore: bump migration script package version to X.X.X-dev.X for release"  # Replace X.X.X-dev.X here too
npm login
npm publish --tag dev
```
