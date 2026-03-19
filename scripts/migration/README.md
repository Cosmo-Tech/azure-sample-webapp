# Azure Sample Webapp - Migration scripts

This folder contains **migration scripts** to help users migrate between major versions of the _Azure Sample Webapp_.
These scripts can not guarantee a full coverage of the manual operations required when switching to a new major version,
but they can automate some parts of the migration.

| :exclamation: Before running these scripts, please make sure you don't have uncommitted local changes in your webapp project. |
| ----------------------------------------------------------------------------------------------------------------------------- |

This migration script requires **Node 24** or above to run. If you don't already have this version, you can install it
with:

```
nvm install 24
nvm use 24
```

# Supported versions

## Migrate from v6 to v7

```
npx @cosmotech/migrate-azure-sample-webapp@latest v7 [-s path/to/solution.json|yaml] [-w path/to/workspace.json|yaml] [-f json|yaml]
```

At least one of `-s` or `-w` must be provided.

Options:

- `-s/--solution`: path to your solution file (JSON or YAML)
- `-w/--workspace`: path to your workspace file (JSON or YAML)
- `-f/--format`: output format for the migrated files — `json` (default) or `yaml`

Migrated files are written to a `config_v7/` folder in the current working directory, preserving the original filenames.

# Dev notes

## Run migration scripts from a local repository

- `cd` to the folder containing the migration scripts (with files `migrate.js` and `package.json`) and run `npm link`
- `cd` to the folder where you want to run the migration scripts, and run `migrate-azure-sample-webapp v7`

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
