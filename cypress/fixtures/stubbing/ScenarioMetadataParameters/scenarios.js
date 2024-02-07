// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with metadata',
    runTemplateId: '1',
    runTemplateName: 'Run template with scenario metadata parameters',
  },
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr02',
    name: 'Test Cypress - Stubbed scenario with hidden groups of parameters',
    runTemplateId: 'runTemplateWithHiddenGroups',
    runTemplateName: 'Run template with hidden groups of scenario parameters',
  },
];
