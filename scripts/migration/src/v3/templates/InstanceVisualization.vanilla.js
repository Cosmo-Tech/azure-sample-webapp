const DATA_SOURCE = null;
const DATA_CONTENT = null;

// Note: "module.exports" style is necessary to be able to read this file from nodejs, when building the webapp
// (imported in config-overrides.js file to add a custom connect-src in CSP rules)
module.exports = { dataSource: DATA_SOURCE, dataContent: DATA_CONTENT };
