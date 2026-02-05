// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIOS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario for scenario parameters inputs',
    runTemplateId: 'sim_brewery_parameters',
    runTemplateName: 'Run template for scenario parameters input validation',
  },
];
