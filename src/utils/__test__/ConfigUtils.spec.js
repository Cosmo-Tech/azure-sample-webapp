// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import merge from 'deepmerge';
import { SolutionSchema } from '../../services/config/SolutionSchema';
import { WorkspaceSchema } from '../../services/config/WorkspaceSchema';
import { ConfigUtils } from '../ConfigUtils';

describe('buildExtendedVarType with possible values', () => {
  test.each`
    varType      | extension      | expectedRes
    ${null}      | ${null}        | ${undefined}
    ${null}      | ${undefined}   | ${undefined}
    ${null}      | ${''}          | ${undefined}
    ${null}      | ${'extension'} | ${undefined}
    ${''}        | ${null}        | ${undefined}
    ${''}        | ${undefined}   | ${undefined}
    ${''}        | ${''}          | ${undefined}
    ${''}        | ${'extension'} | ${undefined}
    ${'varType'} | ${null}        | ${'varType'}
    ${'varType'} | ${undefined}   | ${'varType'}
    ${'varType'} | ${''}          | ${'varType'}
    ${'varType'} | ${'extension'} | ${'varType-extension'}
  `('if "$varType" and "$extension" then "$expectedRes"', ({ varType, extension, expectedRes }) => {
    const res = ConfigUtils.buildExtendedVarType(varType, extension);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('getConversionMethod with possible values', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  function mockMethod(param) {
    return param;
  }

  function mockMethod2(param) {
    return param;
  }

  const arrayWithoutTypes = { noConversionMethod: true };
  const arrayWithVarType = { varType: mockMethod };
  const arrayWithExtendedVarType = { 'varType-extended': mockMethod2 };
  const arrayWithVarTypeAndWrongExtended = { varType: mockMethod, extended: mockMethod2 };
  const arrayWithBoth = { varType: mockMethod, 'varType-extended': mockMethod2 };

  test.each`
    param                      | subType       | functionArray                       | consoleWarnCalls | expectedRes
    ${null}                    | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${undefined}               | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${''}         | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${'extended'} | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${null}       | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${undefined}  | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithExtendedVarType}         | ${0}             | ${mockMethod2}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarTypeAndWrongExtended} | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithBoth}                    | ${0}             | ${mockMethod2}
  `(
    'if param "$param",subType "subType", functionArray "$functionArray"  ' +
      'and consoleWarnCalls "$consoleWarnCalls" then expectedRes "$expectedRes"',
    ({ param, subType, functionArray, consoleWarnCalls, expectedRes }) => {
      const paramWithSubType = { ...param, options: { subType } };
      const res = ConfigUtils.getConversionMethod(paramWithSubType, functionArray);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('warnings in case of solution or workspace misconfiguration', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  const solution = {
    id: 'solution1',
    organizationId: 'O-123456',
    url: 'someUrl',
    parameters: [
      {
        id: 'parameter1',
        varType: 'int',
        options: {
          validation: 'someValidation',
        },
      },
      {
        id: 'parameter2',
        varType: '%DATASETID%',
        options: {
          subType: 'TABLE',
          columns: [
            {
              field: 'field1',
              acceptsEmptyFields: true,
            },
            { field: 'field2', acceptsEmptyFields: false },
          ],
        },
      },
    ],
    parameterGroups: [
      {
        id: 'pg1',
        parameters: ['parameter1', 'parameter2'],
      },
    ],
    runTemplates: [
      {
        id: 'rt1',
        name: 'Run template 1',
      },
    ],
  };
  const solutionWithWrongType = { ...solution };
  solutionWithWrongType.parameterGroups[0].parameters.push(5);
  const solutionWithWrongKey = { ...solution, csmsimulator: 'csmsimulator' };
  const solutionWithWrongParameterKey = {
    ...solution,
    parameters: [...solution.parameters, { id: 'p3', vartype: 'number' }],
  };
  const solutionWithWrongOptionsKey = {
    ...solution,
    parameters: [...solution.parameters, { id: 'p4', varType: '%DATASETID%', options: { subtype: 'TABLE' } }],
  };
  const solutionWithWrongColumnKey = {
    ...solution,
    parameters: [
      ...solution.parameters,
      { id: 'p5', varType: '%DATASETID%', options: { columns: [{ acceptsEmptyField: true }] } },
    ],
  };
  const solutionWithWrongPGKey = {
    ...solution,
    parameterGroups: [...solution.parameterGroups, { id: 'pg2', istable: false }],
  };
  const solutionWithWrongPGOptionsKey = {
    ...solution,
    parameterGroups: [...solution.parameterGroups, { id: 'pg3', options: { authorizedroles: [] } }],
  };
  const solutionWithWrongRunTemplateKey = {
    ...solution,
    runTemplates: [...solution.runTemplates, { id: 'rt2', computesize: 'computesize' }],
  };
  const solutionWithSixWrongKeys = merge.all([
    solutionWithWrongKey,
    solutionWithWrongParameterKey,
    solutionWithWrongOptionsKey,
    solutionWithWrongPGKey,
    solutionWithWrongPGOptionsKey,
    solutionWithWrongRunTemplateKey,
  ]);
  const solutionWithDeeplyNestedColumnsGroup = {
    ...solution,
    parameters: [
      {
        id: 'nestedColumnsTable',
        varType: '%DATASETID%',
        options: {
          subType: 'TABLE',
          columns: [
            { field: 'column1', type: ['int'] },
            {
              headerName: 'columnGroup1',
              children: [
                { field: 'column2' },
                { field: 'column3' },
                {
                  headerName: 'columnGroup2',
                  children: [
                    { field: 'column4' },
                    { field: 'column5' },
                    {
                      headerName: 'columnGroup3',
                      children: [
                        { field: 'column6' },
                        { field: 'column7' },
                        {
                          headerName: 'columnGroup4',
                          children: [
                            { field: 'column8' },
                            { field: 'column9' },
                            {
                              headerName: 'columnGroup5',
                              children: [
                                { field: 'column10' },
                                { field: 'column11' },
                                {
                                  headerName: 'columnGroup6',
                                  children: [
                                    { field: 'column12' },
                                    { field: 'column13' },
                                    {
                                      headerName: 'columnGroup7',
                                      children: [{ field: 'column14' }, { field: 'column15' }],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { field: 'column16', type: ['int'] },
          ],
        },
      },
    ],
  };

  const workspace = {
    id: 'W-workspace1',
    webApp: {
      options: {
        charts: {
          workspaceId: '12345',
          dashboardsView: [
            {
              reportId: '123456',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
              dynamicFilters: [{ table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' }],
            },
          ],
          scenarioView: {
            1: {
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              staticFilters: [{ table: 'Bar', column: 'Bar', values: ['MyBar', 'MyBar2'] }],
              dynamicFilters: [{ table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' }],
            },
          },
        },
        instanceView: {
          dataSource: {
            type: 'adt',
            functionUrl: 'url',
          },
          dataContent: {
            compounds: {},
            edges: {},
            nodes: {},
          },
        },
      },
    },
  };
  const workspaceWithWrongKey = { ...workspace, dedicatedEventHubAuthenticationstrategy: 'someConfig' };
  const workspaceWithWrongSolutionKey = { ...workspace, solution: { defaultrunTemplateDataset: {} } };
  const workspaceWithTwoWrongKeys = {
    ...workspace,
    solution: { defaultrunDataset: {}, runtemplateFilter: [] },
  };
  const workspaceWithWrongWebAppKey = { ...workspace, webApp: { options: { datasetfilter: [] } } };
  const workspaceWithWrongChartsKey = {
    ...workspace,
    webApp: { options: { charts: { scenarioViewiframeDisplayRatio: 1 } } },
  };
  const workspaceWithWrongIVKey = { ...workspace, webApp: { options: { instanceView: { datasource: {} } } } };

  test.each`
    solution
    ${solution}
    ${solutionWithWrongType}
    ${undefined}
    ${null}
    ${{}}
    ${solutionWithDeeplyNestedColumnsGroup}
  `('checks console.warn is not displayed when no unknown keys in solution', ({ data }) => {
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, data);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
  });

  test('checks console.warn is not displayed when no unknown keys in workspace config', () => {
    ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, workspace);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    workspace.webApp.options.charts.logInWithUserCredentials = 'false';
    ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, workspace);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
  });
  test('parsing function sees the difference between solution and workspace object', () => {
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, solutionWithWrongKey);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('Your solution contains'));
    spyConsoleWarn.mockClear();
    ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, workspaceWithWrongKey);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('Your workspace configuration contains'));
  });

  test.each`
    solution                           | expectedCalledWith                 | expectedKey
    ${solutionWithWrongKey}            | ${'Your solution contains'}        | ${'csmsimulator'}
    ${solutionWithWrongParameterKey}   | ${"Parameter with id 'p3'"}        | ${'vartype'}
    ${solutionWithWrongOptionsKey}     | ${"Parameter with id 'p4'"}        | ${'subtype'}
    ${solutionWithWrongColumnKey}      | ${"Parameter with id 'p5'"}        | ${'acceptsEmptyField'}
    ${solutionWithWrongPGKey}          | ${"Parameter group with id 'pg2'"} | ${'istable'}
    ${solutionWithWrongPGOptionsKey}   | ${"Parameter group with id 'pg3'"} | ${'authorizedroles'}
    ${solutionWithWrongRunTemplateKey} | ${"Run template with id 'rt2'"}    | ${'computesize'}
  `('checks console.warn with given solution config', ({ solution, expectedCalledWith, expectedKey }) => {
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, solution);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining(expectedCalledWith));
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining(expectedKey));
  });
  test('checks six console.warns are displayed for six errors in config', () => {
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, solutionWithSixWrongKeys);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(6);
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(1, expect.stringContaining("Parameter with id 'p3'"));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(1, expect.stringContaining('vartype'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(2, expect.stringContaining("Parameter with id 'p4'"));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(2, expect.stringContaining('subtype'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(3, expect.stringContaining("Parameter group with id 'pg2'"));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(3, expect.stringContaining('istable'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(4, expect.stringContaining("Parameter group with id 'pg3'"));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(4, expect.stringContaining('authorizedroles'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(5, expect.stringContaining("Run template with id 'rt2'"));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(5, expect.stringContaining('computesize'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(6, expect.stringContaining('Your solution contains'));
    expect(spyConsoleWarn).toHaveBeenNthCalledWith(6, expect.stringContaining('csmsimulator'));
  });
  test('error is detected in deeply nested columns object', () => {
    const solutionWithDeeplyNestedColumnsGroupWithErrors = { ...solutionWithDeeplyNestedColumnsGroup };
    // eslint-disable-next-line max-len
    solutionWithDeeplyNestedColumnsGroupWithErrors.parameters[0].options.columns[1].children[2].children[2].children[2].children[2].children[2].children[2].headername =
      'columnsGroup6';
    ConfigUtils.checkUnknownKeysInConfig(SolutionSchema, solutionWithDeeplyNestedColumnsGroupWithErrors);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining("Parameter with id 'nestedColumnsTable'"));
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('headername'));
  });
  test.each`
    workspace                        | expectedCalledWith                | expectedKey
    ${workspaceWithWrongKey}         | ${'Your workspace configuration'} | ${'dedicatedEventHubAuthenticationstrategy'}
    ${workspaceWithWrongWebAppKey}   | ${'WebApp section'}               | ${'datasetfilter'}
    ${workspaceWithWrongSolutionKey} | ${'Solution section'}             | ${'defaultrunTemplateDataset'}
    ${workspaceWithWrongChartsKey}   | ${'Charts section'}               | ${'scenarioViewiframeDisplayRatio'}
    ${workspaceWithWrongIVKey}       | ${'Instance view section'}        | ${'datasource'}
    ${workspaceWithTwoWrongKeys}     | ${'Solution section'}             | ${'defaultrunDataset, runtemplateFilter'}
  `('checks console.warn with given workspace config', ({ workspace, expectedCalledWith, expectedKey }) => {
    ConfigUtils.checkUnknownKeysInConfig(WorkspaceSchema, workspace);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining(expectedCalledWith));
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining(expectedKey));
  });
});
