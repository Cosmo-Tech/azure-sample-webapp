// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIOS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with file parameters',
    runTemplateId: 'all_parameters',
    runTemplateName: 'Run template with files & tables parameters',
  },
];
