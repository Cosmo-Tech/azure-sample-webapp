// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';

export const SCENARIO_WITH_DESCRIPTION_AND_TAGS = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-stubbedrnnr01',
  name: '1 - Scenario with tags',
  runTemplateId: 'sim_brewery_parameters',
  tags: ['brewery', 'tag', 'cypress'],
  description: 'A short description of a scenario to easily keep track of its purpose',
};
