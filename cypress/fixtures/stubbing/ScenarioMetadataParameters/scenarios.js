// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with metadata',
    runTemplateId: 'sim_brewery_parameters',
    runTemplateName: 'Run template with scenario metadata parameters',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 'r-stubbedscnr02',
    name: 'Test Cypress - Stubbed scenario with hidden groups of parameters',
    runTemplateId: 'runTemplateWithHiddenGroups',
    runTemplateName: 'Run template with hidden groups of scenario parameters',
  },
];
