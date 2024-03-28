// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DatasetsUtils } from '../DatasetsUtils';

const datasetListWithChildren = [
  {
    id: '1',
    name: 'Dataset 1',
    parentId: null,
  },
  {
    id: '2',
    name: 'Dataset 2',
    parentId: '1',
  },
  {
    id: '3',
    name: 'Dataset 3',
    parentId: null,
  },
  {
    id: '4',
    name: 'Dataset 4',
    parentId: '3',
  },
  {
    id: '5',
    name: 'Dataset 5',
    parentId: '3',
  },
  {
    id: '6',
    name: 'Dataset 6',
    parentId: '5',
  },
];

const datasetListWithoutChildren = [
  {
    id: '1',
    name: 'Dataset 1',
    parentId: null,
  },
  {
    id: '2',
    name: 'Dataset 2',
    parentId: null,
  },
  {
    id: '3',
    name: 'Dataset 3',
    parentId: null,
  },
];

const datasetTreeOne = ['Dataset 4', 'Dataset 5', 'Dataset 6'];
const datasetTreeTwo = ['Dataset 2'];

describe('datasets tree', () => {
  test.each`
    datasetList                   | initialDatasetId | result
    ${datasetListWithoutChildren} | ${'1'}           | ${[]}
    ${datasetListWithChildren}    | ${'3'}           | ${datasetTreeOne}
    ${datasetListWithChildren}    | ${'1'}           | ${datasetTreeTwo}
    ${datasetListWithoutChildren} | ${'8'}           | ${[]}
    ${datasetListWithChildren}    | ${'8'}           | ${[]}
    ${datasetListWithChildren}    | ${'2'}           | ${[]}
    ${null}                       | ${'1'}           | ${[]}
    ${undefined}                  | ${'1'}           | ${[]}
    ${[]}                         | ${'1'}           | ${[]}
    ${{}}                         | ${'1'}           | ${[]}
    ${datasetListWithoutChildren} | ${undefined}     | ${[]}
    ${datasetListWithoutChildren} | ${null}          | ${[]}
    ${datasetListWithoutChildren} | ${{}}            | ${[]}
    ${datasetListWithChildren}    | ${undefined}     | ${[]}
    ${datasetListWithChildren}    | ${null}          | ${[]}
    ${datasetListWithChildren}    | ${{}}            | ${[]}
  `('dataset tree is correctly built', ({ datasetList, initialDatasetId, result }) => {
    const tree = DatasetsUtils.getAllChildrenDatasetsNames(initialDatasetId, datasetList);
    expect(tree).toStrictEqual(result);
  });
});
