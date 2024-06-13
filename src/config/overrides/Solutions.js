// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the SOLUTIONS array below to override or add information to your solutions. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Solution instead for
// production environments.
export const SOLUTIONS = [
  {
    id: 'SOL-VkqXyNONQyB',
    runTemplates: [
      {
        id: '3',
        name: 'Run template with mock basic types parameters',
        labels: {
          fr: 'Run template avec paramètres basiques fictifs',
          en: 'Run template with mock basic types parameters',
        },
        description: 'Run template with mock basic types parameters',
        csmSimulation: 'BreweryDemoSimulationWithConnector',
        tags: ['3', 'Example'],
        computeSize: null,
        runSizing: null,
        noDataIngestionState: null,
        fetchDatasets: true,
        scenarioDataDownloadTransform: null,
        fetchScenarioParameters: false,
        applyParameters: false,
        validateData: false,
        sendDatasetsToDataWarehouse: true,
        sendInputParametersToDataWarehouse: false,
        preRun: false,
        run: true,
        postRun: false,
        parametersJson: null,
        parametersHandlerSource: null,
        datasetValidatorSource: null,
        preRunSource: null,
        runSource: null,
        postRunSource: null,
        scenariodataTransformSource: null,
        parameterGroups: ['cyphercustomers'],
        stackSteps: null,
        gitRepositoryUrl: null,
        gitBranchName: null,
        runTemplateSourceDir: null,
        orchestratorType: 'argoWorkflow',
        executionTimeout: null,
        deleteHistoricalData: null,
      },
    ],
    parameterGroups: [
      {
        id: 'cyphercustomers',
        labels: {
          fr: 'Cypher',
          en: 'Cypher',
        },
        isTable: null,
        options: null,
        parentId: null,
        parameters: ['newcustomers'],
      },
    ],
    parameters: [
      {
        id: 'newcustomers',
        labels: {
          fr: 'Clients',
          en: 'Customers',
        },
        varType: '%DATASETID%',
        defaultValue: null,
        minValue: null,
        maxValue: null,
        regexValidation: null,
        options: {
          canChangeRowsNumber: true,
          connectorId: 'c-d7e5p9o0kjn9',
          description: 'customers data',
          subType: 'GRAPHTABLE',
          source: {
            query: 'MATCH(customer: Customer) RETURN customer',
            resultKey: 'customer',
          },
          columns: [
            {
              field: 'id',
              headerName: 'Name',
              type: ['string'],
            },
            {
              field: 'Satisfaction',
              headerName: 'Satisfaction',
              type: ['int'],
              minValue: 0,
              maxValue: 10,
              acceptsEmptyFields: true,
            },
            {
              field: 'SurroundingSatisfaction',
              headerName: 'SurroundingSatisfaction',
              type: ['int'],
              minValue: 0,
              maxValue: 10,
              acceptsEmptyFields: true,
            },
            {
              field: 'Thirsty',
              headerName: 'Thirsty',
              type: ['bool'],
              acceptsEmptyFields: true,
            },
          ],
        },
      },
    ],
  },
];
