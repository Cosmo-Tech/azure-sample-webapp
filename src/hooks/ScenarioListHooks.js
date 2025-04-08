// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ResourceUtils } from '@cosmotech/core';
import { useRunners } from '../state/runner/hooks';

export const useSortedScenarioList = () => {
  const scenarios = useRunners();
  return scenarios ? ResourceUtils.getResourceTree(scenarios.slice()) : [];
};
