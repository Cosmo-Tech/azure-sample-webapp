// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

const _sortByName = (scenarios) => {
  return scenarios.sort((scenarioA, scenarioB) =>
    scenarioA.name.toUpperCase() < scenarioB.name.toUpperCase() ? -1 : 1
  );
};

export const sortScenarioList = (scenarioList) => {
  const sortedList = [];
  let scenarioListCopy = clone(scenarioList);
  _sortByName(scenarioListCopy);

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

export const getFirstScenarioMaster = (scenarioList) => {
  if (scenarioList.length > 0) {
    const scenarioMasterList = scenarioList.filter((scenario) => scenario.parentId === null);
    if (scenarioMasterList.length === 0) {
      console.warn('Scenario list is corrupted, no root scenarios found');
      return _sortByName(scenarioList)[0];
    }
    return _sortByName(scenarioMasterList)[0];
  } else {
    return null;
  }
};
