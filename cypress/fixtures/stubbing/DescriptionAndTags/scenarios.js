// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_EXAMPLE } from '../default';

export const SCENARIO_WITH_DESCRIPTION_AND_TAGS = {
  ...SCENARIO_EXAMPLE,
  id: 's-stubbedscnr01',
  name: '1 - Scenario with tags',
  tags: ['brewery', 'tag', 'cypress'],
  description: 'A short description of a scenario to easily keep track of its purpose',
};
