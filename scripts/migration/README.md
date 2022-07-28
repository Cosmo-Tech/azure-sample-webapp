# Azure Sample Webapp - Migration scripts

This folder contains **migration scripts** to help users migrate between major versions of the _Azure Sample Webapp_.
These scripts can not guarantee a full coverage of the manual operations required when switching to a new major version,
but they can automate some parts of the migration.

| :exclamation: Before running these scripts, please make sure you don't have uncommitted local changes in your webapp project. |
| ----------------------------------------------------------------------------------------------------------------------------- |

# Supported versions

## Migrate from v2 to v3

This migration script requires **Node 16** or above to run. If you don't already have this version, you can install it
with:

```
nvm install 16
nvm use 16
```

You can then run the migration script with `npx @cosmotech/migrate-azure-sample-webapp v3`

# Dev notes

##Run migration scripts from a local repository

- `cd` to the folder containing the migration scripts (with files `migrate.js` and `package.json`) and run `npm link`
- `cd` to the folder where you want to run the migration scripts, and run `migrate-azure-sample-webapp v3`
