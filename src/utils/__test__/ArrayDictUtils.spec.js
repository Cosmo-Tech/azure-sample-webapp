// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ArrayDictUtils } from '../ArrayDictUtils';

describe('mergeArraysByElementsIds', () => {
  const defaultArray = [
    { id: 'id1', value: 'value1', nested: { 1: 1, 2: 2 } },
    { id: 'id2', value: 'value2' },
    { id: 'id3', value: 'value3' },
    null,
  ];
  const overridingArray = [
    { id: 'id1', value: 'newValue1', nested: { 2: 'two', 3: 3 } },
    { id: 'id2', newAttribute: 'attribute2' },
    { id: 'id4', value: 'value4' },
    undefined,
  ];
  const mergedResult = [
    { id: 'id1', value: 'newValue1', nested: { 1: 1, 2: 'two', 3: 3 } },
    { id: 'id2', value: 'value2', newAttribute: 'attribute2' },
    { id: 'id3', value: 'value3' },
    null,
    { id: 'id4', value: 'value4' },
    undefined,
  ];

  test.each`
    array1          | array1Str         | array2             | array2Str            | expectedRes
    ${null}         | ${null}           | ${null}            | ${null}              | ${[]}
    ${[]}           | ${[]}             | ${[]}              | ${[]}                | ${[]}
    ${null}         | ${null}           | ${defaultArray}    | ${'defaultArray'}    | ${defaultArray}
    ${defaultArray} | ${'defaultArray'} | ${null}            | ${null}              | ${defaultArray}
    ${[]}           | ${[]}             | ${defaultArray}    | ${'defaultArray'}    | ${defaultArray}
    ${defaultArray} | ${'defaultArray'} | ${[]}              | ${[]}                | ${defaultArray}
    ${defaultArray} | ${'defaultArray'} | ${overridingArray} | ${'overridingArray'} | ${mergedResult}
  `('if array1=$array1Str and array2=$array2Str, then $expectedRes', ({ array1, array2, expectedRes }) => {
    const res = ArrayDictUtils.mergeArraysByElementsIds(array1, array2);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('reshapeConfigArrayToDictById', () => {
  const arrayA = [{ id: 'id1', value: 'value1' }];
  const arrayB = [
    { id: 'id1', value: 'value1' },
    { id: 'id2', value: 'value2' },
    { id: 'id3', value: 'value3' },
  ];
  const dictA = {
    id1: { id: 'id1', value: 'value1' },
  };
  const dictB = {
    id1: { id: 'id1', value: 'value1' },
    id2: { id: 'id2', value: 'value2' },
    id3: { id: 'id3', value: 'value3' },
  };

  test.each`
    array        | arrayStr     | expectedRes
    ${null}      | ${null}      | ${{}}
    ${undefined} | ${undefined} | ${{}}
    ${[]}        | ${[]}        | ${{}}
    ${arrayA}    | ${'arrayA'}  | ${dictA}
    ${arrayB}    | ${'arrayB'}  | ${dictB}
  `('if array=$arrayStr, then $expectedRes', ({ array, expectedRes }) => {
    const res = ArrayDictUtils.reshapeConfigArrayToDictById(array);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('reshapeDictToArrayById', () => {
  const arrayA = [{ id: 'id1', value: 'value1' }];
  const arrayB = [
    { id: 'id1', value: 'value1' },
    { id: 'id2', value: 'value2' },
    { id: 'id3', value: 'value3' },
  ];
  const dictA = {
    id1: { id: 'id1', value: 'value1' },
  };
  const dictB = {
    id1: { id: 'id1', value: 'value1' },
    id2: { id: 'id2', value: 'value2' },
    id3: { id: 'id3', value: 'value3' },
  };

  test.each`
    dict         | dictStr      | expectedRes
    ${null}      | ${null}      | ${[]}
    ${undefined} | ${undefined} | ${[]}
    ${{}}        | ${{}}        | ${[]}
    ${dictA}     | ${'dictA'}   | ${arrayA}
    ${dictB}     | ${'dictB'}   | ${arrayB}
  `('if dict=$dictStr, then $expectedRes', ({ dict, expectedRes }) => {
    const res = ArrayDictUtils.reshapeDictToArrayById(dict);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('removeUndefinedValuesFromDict', () => {
  const datasetObjectForFromScratch = {
    name: 'Dataset1',
    description: undefined,
    tags: undefined,
    sourceType: 'None',
  };

  const filteredDatasetObjectForFromScratch = {
    name: 'Dataset1',
    sourceType: 'None',
  };

  const datasetObjectForADT = {
    name: 'Dataset1',
    description: undefined,
    tags: undefined,
    sourceType: 'ADT',
    source: {
      path: undefined,
      location: 'location',
      name: undefined,
    },
  };

  const filteredDatasetObjectForADT = {
    name: 'Dataset1',
    sourceType: 'ADT',
    source: {
      location: 'location',
    },
  };

  test.each`
    initialDatasetObject           | filteredDatasetObject
    ${datasetObjectForFromScratch} | ${filteredDatasetObjectForFromScratch}
    ${datasetObjectForADT}         | ${filteredDatasetObjectForADT}
    ${{}}                          | ${{}}
    ${null}                        | ${null}
    ${undefined}                   | ${undefined}
    ${[]}                          | ${[]}
  `('dataset object is correctly filtered', ({ initialDatasetObject, filteredDatasetObject }) => {
    ArrayDictUtils.removeUndefinedValuesFromDict(initialDatasetObject);
    expect(initialDatasetObject).toStrictEqual(filteredDatasetObject);
  });
});
