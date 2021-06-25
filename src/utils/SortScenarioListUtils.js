// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

export const sortScenarioList = (scenarioList) => {
  const sortedList = [];
  let hasMovedScenarios = true;
  while (hasMovedScenarios && scenarioList.length !== 0) {
    const scenarioListCopy = clone(scenarioList);
    hasMovedScenarios = false;
    for (let i = 0; i < scenarioListCopy.length; ++i) {
      const scenario = scenarioListCopy[i];
      if (scenario.parentId === null) {
        sortedList.push(scenario);
        scenario.depth = 0;
        const scenarioId = scenarioList.findIndex((current) => current.id === scenario.id);
        scenarioList.splice(scenarioId, 1);
      } else {
        const parentScenarioId = scenario.parentId;
        const parentPosInSortedList = sortedList.findIndex((current) => current.id === parentScenarioId);
        if (parentPosInSortedList !== -1) {
          scenario.depth = sortedList[parentPosInSortedList].depth + 1;
          sortedList.splice(parentPosInSortedList + 1, 0, scenario);
          const scenarioId = scenarioList.findIndex((current) => current.id === scenario.id);
          scenarioList.splice(scenarioId, 1);
          hasMovedScenarios = true;
        }
      }
    }
  }
  return sortedList;
};
