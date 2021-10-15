// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

export const sortScenarioList = (scenarioList) => {
  const sortedList = [];
  let scenarioListCopy = clone(scenarioList);
  scenarioListCopy.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));

  const buildScenarioTree = (idParent, depth) => {
    const scenarioListToFilter = [];
    for (const scenario of scenarioListCopy) {
      if (scenario.parentId === idParent) {
        scenario.depth = depth;
        sortedList.push(scenario);
        scenarioListToFilter.push(scenario);
        buildScenarioTree(scenario.id, depth + 1);
      }
    }
    scenarioListCopy = scenarioListCopy.filter((scenario) => !scenarioListToFilter.includes(scenario));
  };

  buildScenarioTree(null, 0);

  return sortedList;
};
