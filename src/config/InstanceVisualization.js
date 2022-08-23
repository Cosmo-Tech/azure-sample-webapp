// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const DATA_SOURCE = {
  type: 'adt',
  // functionUrl: 'http://localhost:7071/api/ScenarioDownload', // Use for a local azure function
  functionUrl: 'https://scenario-download-brewery-dev.azurewebsites.net/api/ScenarioDownload',
  functionKey: 'sFGoW45A4TthGp9bunsKhzH7A8a4nR-JK82jjHQ6Ja-WAzFuFc-sOg==',
};

const DATA_CONTENT = {
  compounds: {
    Bar_vertex: {},
  },
  edges: {
    arc_Satisfaction: { style: { 'line-color': '#999999' }, selectable: false },
  },
  nodes: {
    Bar: {
      style: {
        shape: 'rectangle',
        'background-color': '#466282',
        'background-opacity': 0.2,
        'border-width': 0,
      },
      pannable: true,
      selectable: true,
      grabbable: false,
    },
    Customer: {
      style: {
        'background-color': '#005A31',
        shape: 'ellipse',
      },
    },
  },
};

// Note: "module.exports" style is necessary to be able to read this file from nodejs, when building the webapp
// (imported in config-overrides.js file to add a custom connect-src in CSP rules)
module.exports = { dataSource: DATA_SOURCE, dataContent: DATA_CONTENT };
