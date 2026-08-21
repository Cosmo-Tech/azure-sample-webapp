// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';
import { ALL_PARAMETER_GROUPS } from './parameterGroups';
import { ALL_PARAMETERS } from './parameters';
import { ALL_RUN_TEMPLATES } from './runTemplates';

export const SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: [...DEFAULT_SOLUTION.parameters, ...ALL_PARAMETERS],
  parameterGroups: [...DEFAULT_SOLUTION.parameterGroups, ...ALL_PARAMETER_GROUPS],
  runTemplates: [...DEFAULT_SOLUTION.runTemplates, ...ALL_RUN_TEMPLATES],
};
