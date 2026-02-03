// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIOS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedscnr01',
    name: 'Test Cypress - Scenario with dates initialized',
    runTemplateId: 'dates',
    runTemplateName: 'Run template with dates',
    parametersValues: [
      {
        parameterId: 'start_date',
        varType: 'date',
        value: '2025-01-20T00:00:00Z',
        isInherited: false,
      },
      {
        parameterId: 'end_date',
        varType: 'date',
        value: '2025-07-25T00:00:00Z',
        isInherited: false,
      },
    ],
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedscnr02',
    name: 'Test Cypress - Scenario with dates NOT initialized',
    runTemplateId: 'dates',
    runTemplateName: 'Run template with dates',
  },
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-stubbedscnr03',
    name: 'Test Cypress - Scenario 2 with dates NOT initialized',
    runTemplateId: 'dates',
    runTemplateName: 'Run template with dates',
  },
];
