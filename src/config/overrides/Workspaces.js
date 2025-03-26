// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the WORKSPACES array below to override or add information to your workspaces. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Workspace instead for
// production environments.
export const WORKSPACES = [
  {
    id: 'w-lzoog8x72dk',
    webApp: {
      options: {
        instanceView: {
          dataSource: {
            type: 'twingraph_dataset',
          },
          dataContent: {
            compounds: { Bar_vertex: {} },
            edges: { arc_Satisfaction: { style: {}, selectable: false } },
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
                attributesOrder: ['id', 'Stock', 'RestockQty', 'NbWaiters'],
              },
              Customer: {
                style: { 'background-color': '#005A31', shape: 'ellipse' },
                attributesOrder: ['id', 'Thirsty', 'Satisfaction', 'SurroundingSatisfaction'],
              },
            },
          },
        },
        menu: {
          supportUrl: 'https://support.cosmotech.com',
          organizationUrl: 'https://cosmotech.com',
          documentationUrl: 'https://portal.cosmotech.com/resources/platform-resources/web-app-user-guide',
        },
      },
    },
  },
];
