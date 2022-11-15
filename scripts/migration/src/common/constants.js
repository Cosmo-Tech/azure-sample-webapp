// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const SELF_CMD_LINE = 'npx @cosmotech/migrate-azure-sample-webapp';
const VALID_TARGET_VERSIONS = ['v3', 'v5'];
const LATEST_VERSION = VALID_TARGET_VERSIONS[VALID_TARGET_VERSIONS.length - 1];

module.exports = { SELF_CMD_LINE, VALID_TARGET_VERSIONS, LATEST_VERSION };
