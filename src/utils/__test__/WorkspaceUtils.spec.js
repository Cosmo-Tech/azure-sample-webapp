// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WorkspacesUtils } from '../WorkspacesUtils';

describe('checkDatasetManagerConfiguration', () => {
  const forgeWorkspaceFromConfig = (config) => ({ webApp: { options: { datasetManager: config } } });
  const spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

  afterEach(() => {
    spyConsoleWarn.mockReset();
  });

  const kpi1 = { id: 'kpi', queryId: 'query' };
  const kpi2 = { id: 'foo', queryId: 'fooQuery' };
  const query1 = { id: 'query', query: '' };
  const query2 = { id: 'fooQuery', query: '' };

  test('it should not print warnings for valid configurations', () => {
    const validConfigs = [
      undefined,
      null,
      {},
      { graphIndicators: null, categories: null, queries: null },
      { graphIndicators: [kpi1, kpi2], categories: [], queries: [query1, query2] },
      { graphIndicators: [], categories: [{ id: 'category', kpis: [kpi1, kpi2] }], queries: [query1, query2] },
      { graphIndicators: [kpi1], categories: [{ id: 'foos', kpis: [kpi2] }], queries: [query1, query2] },
    ];
    validConfigs.forEach((config) =>
      WorkspacesUtils.checkDatasetManagerConfiguration(forgeWorkspaceFromConfig(config))
    );
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
  });

  test.each`
    invalidConfig
    ${[]}
    ${'a'}
    ${0}
    ${true}
  `('it should print warnings for invalid configuration object $invalidConfig', ({ invalidConfig }) => {
    WorkspacesUtils.checkDatasetManagerConfiguration(forgeWorkspaceFromConfig(invalidConfig));
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
  });

  test('it should print warnings for partially valid configurations', () => {
    const invalidConfigs = [
      // Missing queries
      { warnings: 1, graphIndicators: [kpi1] },
      { warnings: 1, graphIndicators: [kpi1], queries: [] },
      { warnings: 1, graphIndicators: [kpi1], queries: [query2] },
      { warnings: 1, categories: [{ id: 'category', kpis: [kpi2] }] },
      { warnings: 1, categories: [{ id: 'category', kpis: [kpi2] }], queries: [] },
      { warnings: 1, categories: [{ id: 'category', kpis: [kpi2] }], queries: [query1] },
      { warnings: 2, graphIndicators: [kpi1], categories: [{ id: 'category', kpis: [kpi2] }], queries: [] },
      // Duplicated kpis id
      { warnings: 1, graphIndicators: [kpi1, kpi1], queries: [query1] },
      { warnings: 1, categories: [{ id: 'category', kpis: [kpi1, kpi1] }], queries: [query1] },
      { warnings: 1, graphIndicators: [kpi1], categories: [{ id: 'category', kpis: [kpi1] }], queries: [query1] },
      // Wrong types instead of arrays
      { warnings: 3, graphIndicators: '', categories: {}, queries: false },
      { warnings: 3, graphIndicators: true, categories: 10, queries: 'c' },
      { warnings: 1, categories: [{ id: 'category', kpis: '' }] },
      { warnings: 1, categories: [{ id: 'category', kpis: {} }] },
      { warnings: 1, categories: [{ id: 'category', kpis: true }] },
      { warnings: 1, categories: [{ id: 'category', kpis: 0 }] },
      // Missing parts of kpis
      { warnings: 1, graphIndicators: [{ id: kpi1.id }], queries: [query1] },
      { warnings: 1, graphIndicators: [{ queryId: kpi1.queryId }], queries: [query1] },
      { warnings: 1, categories: [{ id: 'category', kpis: [{ id: kpi1.id }] }], queries: [query1] },
      { warnings: 1, categories: [{ id: 'category', kpis: [{ queryId: kpi1.queryId }] }], queries: [query1] },
      // Missing parts of queries
      { warnings: 1, graphIndicators: [], queries: [{ id: query1.id }] },
      { warnings: 1, graphIndicators: [], queries: [{ query: query1.query }] },
    ];

    invalidConfigs.forEach((config) => {
      WorkspacesUtils.checkDatasetManagerConfiguration(forgeWorkspaceFromConfig(config));
      expect(spyConsoleWarn).toHaveBeenCalledTimes(config.warnings);
      spyConsoleWarn.mockReset();
    });
  });
});

describe('forgeDatasetManagerConfiguration', () => {
  test('it returns undefined when the config is invalid', () => {
    const invalidValuesForRoot = [null, undefined, '', 'foo', 0, false];
    const invalidValuesForItems = ['', 'foo', 0, false, {}];
    const invalidConfigs = [
      ...invalidValuesForRoot,
      ...invalidValuesForItems.map((invalidValue) => ({ graphIndicators: invalidValue })),
      ...invalidValuesForItems.map((invalidValue) => ({ categories: invalidValue })),
    ];
    invalidConfigs.forEach((config) =>
      expect(WorkspacesUtils.forgeDatasetManagerConfiguration(config)).toEqual(undefined)
    );
  });

  test('building the indicators item skips invalid data when categories config is partially valid', () => {
    const expectedIndicators = { categoriesKpis: ['id'], graphIndicators: [] };
    const config = {
      categories: [
        { id: 'foo' }, // category without kpis
        {
          id: 'bar',
          kpis: [
            { id: 'id', queryId: 'queryId' },
            { queryId: 'bars' }, // missing KPI id
          ],
        },
        {
          id: 'baz',
          kpis: { invalid: 'not an array' },
        },
      ],
    };
    const { indicators } = WorkspacesUtils.forgeDatasetManagerConfiguration(config);
    expect(indicators).toEqual(expectedIndicators);
  });

  test('building the indicators item skips invalid data when graphIndicators config is partially valid', () => {
    const expectedIndicators = { categoriesKpis: [], graphIndicators: ['id'] };
    const config = {
      graphIndicators: [
        { id: 'id', queryId: 'queryId' },
        { queryId: 'bars' }, // missing indicator id
      ],
    };
    const { indicators } = WorkspacesUtils.forgeDatasetManagerConfiguration(config);
    expect(indicators).toEqual(expectedIndicators);
  });

  test('building the queriesMapping item skips when config data is partially valid', () => {
    const expectedQueriesMapping = { queryId1: ['id1'], queryId2: ['id2'] };
    const config = {
      graphIndicators: [
        {},
        { queryId: 'invalid_1' }, // missing indicator id
        { id: 'invalid_2' }, // missing query id
        { id: 'id1', queryId: 'queryId1' },
      ],
      categories: [
        { id: 'category_without_kpis' },
        { id: 'category_with_null_kpis', kpis: null },
        {
          id: 'category_with_kpis',
          kpis: [
            {},
            { queryId: 'invalid_3' }, // missing indicator id
            { id: 'invalid_4' }, // missing query id
            { id: 'id2', queryId: 'queryId2' },
          ],
        },
      ],
      queries: 'property not used in this function, its type is not checked (it should be an Array)',
    };
    const { queriesMapping } = WorkspacesUtils.forgeDatasetManagerConfiguration(config);
    expect(queriesMapping).toEqual(expectedQueriesMapping);
  });
});
