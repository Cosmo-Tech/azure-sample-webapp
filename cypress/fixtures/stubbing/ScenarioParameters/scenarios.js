// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIOS_WITH_DYNAMIC_NUMBERS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with DYNAMIC NUMBERS',
    runTemplateId: 'dynamic_values',
    runTemplateName: 'Run template with dynamic values',
    datasetList: ['D-stbdefault'],
  },
];
