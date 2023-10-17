// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useScenarioListData } from '../state/hooks/ScenarioHooks';
import { ResourceUtils } from '@cosmotech/core';

export const useSortedScenarioList = () => {
  const scenarioListData = useScenarioListData();
  return scenarioListData ? ResourceUtils.getResourceTree(scenarioListData.slice()) : [];
};
