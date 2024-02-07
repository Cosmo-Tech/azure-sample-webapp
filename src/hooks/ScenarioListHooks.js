// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ResourceUtils } from '@cosmotech/core';
import { useScenarios } from '../state/hooks/ScenarioHooks';

export const useSortedScenarioList = () => {
  const scenarios = useScenarios();
  return scenarios ? ResourceUtils.getResourceTree(scenarios.slice()) : [];
};
