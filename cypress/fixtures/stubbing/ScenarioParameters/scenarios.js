// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIOS_WITH_DYNAMIC_NUMBERS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with DYNAMIC NUMBERS',
    runTemplateId: 'dynamic_values',
    runTemplateName: 'Run template with dynamic values',
  },
];
