// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the WORKSPACES array below to override or add information to your workspaces. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Workspace instead for
// production environments.
export const WORKSPACES = [
  {
    id: 'w-0qq1yk8k42161',
    additionalData: {
      webapp: {
        datasetManager: {
          datasourceFilter: [
            'etl_mock_parameters',
            'etl_instance_generator',
            'FileUploadToDataset',
            'etl_zip2db',
            'None',
          ],
        },
      },
    },
  },
];
