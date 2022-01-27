// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { scenarioList, expectedSortedScenariolist } from './ScenarioListData.js';
import { sortScenarioList, getFirstScenarioMaster } from '../SortScenarioListUtils';

describe('sortScenarioList', () => {
  test('sort scenario list with right depth with an unsorted list', () => {
    const sortedScenarioList = sortScenarioList(scenarioList);
    expect(sortedScenarioList).toStrictEqual(expectedSortedScenariolist);
  });

  test('sort scenario list function with empty list', () => {
    const sortedScenarioList = sortScenarioList([]);
    expect(sortedScenarioList).toStrictEqual([]);
  });
});

describe('getFirstScenarioMaster', () => {
  test('get first scenario master in alphabetic order with unsorted list', () => {
    const firstScenarioMaster = getFirstScenarioMaster(scenarioList);
    expect(firstScenarioMaster.parentId).toBeNull();
    expect(firstScenarioMaster.name).toStrictEqual(expectedSortedScenariolist[0].name);
  });

  test('get first scenario master in alphabetic order with empty list', () => {
    const firstScenarioMaster = getFirstScenarioMaster([]);
    expect(firstScenarioMaster).toBeNull();
  });
});
