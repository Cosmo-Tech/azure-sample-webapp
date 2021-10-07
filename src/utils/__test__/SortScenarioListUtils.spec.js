// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { scenarioList, expectedSortedScenariolist } from './ScenarioListData.js';
import { sortScenarioList } from '../SortScenarioListUtils';

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
