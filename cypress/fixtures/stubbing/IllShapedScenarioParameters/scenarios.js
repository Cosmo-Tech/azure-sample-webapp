// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIOS = [
  {
    ...SCENARIO_EXAMPLE,
    id: 's-stubbedscnr01',
    name: 'Test Cypress - Stubbed scenario with file parameters',
    runTemplateId: 'all_parameters',
    runTemplateName: 'Run template with files & tables parameters',
    parametersValues: [
      {
        parameterId: 'start_date',
        varType: null, // varType set to null on purpose
        value: '2021-01-01T00:00:00.000Z',
      },
    ],
  },
];
