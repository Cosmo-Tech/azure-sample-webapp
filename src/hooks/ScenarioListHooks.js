// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useScenarios } from '../state/hooks/ScenarioHooks';
import { ResourceUtils } from '@cosmotech/core';

export const useSortedScenarioList = () => {
  const scenarios = useScenarios();
  return scenarios ? ResourceUtils.getResourceTree(scenarios.slice()) : [];
};
