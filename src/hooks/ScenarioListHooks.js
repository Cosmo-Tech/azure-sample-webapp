// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { sortScenarioList } from '../utils/SortScenarioListUtils';
import { useScenarioListData } from '../state/hooks/ScenarioHooks';

export const useSortedScenarioList = () => {
  const scenarioListData = useScenarioListData();
  return scenarioListData ? sortScenarioList(scenarioListData.slice()) : [];
};
