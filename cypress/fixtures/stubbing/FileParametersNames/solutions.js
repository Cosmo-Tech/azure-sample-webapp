// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, DEFAULT_RUN_TEMPLATE_PARAMETER } from '../default';

const FILE_OPTIONS = { connectorId: 'c-stbdcnctor' };
const TABLE_OPTIONS = { ...FILE_OPTIONS, subType: 'TABLE', columns: [{ field: 'foo' }] };
const FILE_PARAMETER = {
  ...DEFAULT_RUN_TEMPLATE_PARAMETER,
  varType: '%DATASETID%',
  additionalData: FILE_OPTIONS,
};

const CUSTOM_SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: [
    { ...FILE_PARAMETER, id: 'file_no_renaming' },
    {
      ...FILE_PARAMETER,
      id: 'file_with_renaming',
      additionalData: { ...FILE_OPTIONS, shouldRenameFileOnUpload: true },
    },
    { ...FILE_PARAMETER, id: 'table_no_renaming', additionalData: TABLE_OPTIONS },
    {
      ...FILE_PARAMETER,
      id: 'table_with_renaming',
      additionalData: { ...TABLE_OPTIONS, shouldRenameFileOnUpload: true },
    },
  ],
  parameterGroups: [
    {
      id: 'all_parameters',
      parameters: ['file_no_renaming', 'file_with_renaming', 'table_no_renaming', 'table_with_renaming'],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: 'all_parameters',
      name: 'Run template with files & tables parameters',
      description: 'Run template with files & tables parameters',
      tags: ['all_parameters', 'files', 'tables'],
      parameterGroups: ['all_parameters'],
    },
  ],
};

export const SOLUTIONS = [CUSTOM_SOLUTION];
