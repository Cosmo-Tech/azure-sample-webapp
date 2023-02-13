// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

const _sortByName = (scenarios) => {
  return clone(scenarios).sort((scenarioA, scenarioB) =>
    scenarioA.name.toUpperCase() < scenarioB.name.toUpperCase() ? -1 : 1
  );
};

export const sortScenarioList = (scenarioList) => {
  const sortedList = [];
  let scenarioListCopy = _sortByName(scenarioList);

  const buildScenarioTree = (idParent, depth) => {
    const scenarioListToFilter = [];
    for (const scenario of scenarioListCopy) {
      const parentNotFound = !scenarioList.some((parentScenario) => parentScenario.id === scenario.parentId);
      if (scenario.parentId === idParent || (idParent === null && parentNotFound)) {
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

export const getFirstScenarioMaster = (scenarioList) => {
  if (scenarioList.length > 0) {
    const scenarioMasterList = scenarioList.filter((scenario) => scenario.parentId === null);
    if (scenarioMasterList.length === 0) {
      // Scenario list has not root scenarios: they may not be shared with the current user, or the list may be
      // corrupted.
      return _sortByName(scenarioList)[0];
    }
    return _sortByName(scenarioMasterList)[0];
  } else {
    return null;
  }
};
