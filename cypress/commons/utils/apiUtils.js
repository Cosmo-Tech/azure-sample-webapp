// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { API_ENDPOINT, API_REGEX, AUTH_QUERY_URL, URL_POWERBI, URL_ROOT } from '../constants/generic/TestConstants';
import { stub } from '../services/stubbing';
import { authUtils } from './authUtils';
import utils from '../../commons/TestUtils';
import { DEFAULT_DATASET, SCENARIO_EXAMPLE, SCENARIO_RUN_EXAMPLE } from '../../fixtures/stubbing/default';

const forgeAlias = (prefix) => {
  if (typeof forgeAlias.requestIndex === 'undefined') {
    forgeAlias.requestIndex = 1;
  }
  return `${prefix}_${forgeAlias.requestIndex++}`;
};

const waitAlias = (alias, options) => {
  if (alias) return cy.wait('@' + alias, options);
};

const waitAliases = (aliases, options) => {
  aliases.forEach((alias) => {
    return waitAlias(alias, options);
  });
};

const startInterceptionMiddlewares = () => {
  cy.intercept({ url: API_REGEX.ALL, middleware: true }, (req) => {
    // If authentication stubbing is enabled, use middleware to reset the access token in requests to the CosmoTech API
    // (required if it has been modified by stubbing roles, for instance)
    if (stub.isEnabledFor('AUTHENTICATION') && stub.getActualAccessToken() !== null) {
      req.headers.authorization = 'Bearer ' + stub.getActualAccessToken();
    }
    // If workspace stubbing is enabled, use middleware to reset the workspace id in requests to the CosmoTech API
    // (required if a fake workspace id has been set, for instance)
    if (
      stub.isEnabledFor('GET_WORKSPACES') &&
      stub.getActualWorkspaceId() !== null &&
      stub.getFakeWorkspaceId() !== null
    ) {
      req.url = req.url.replace(stub.getFakeWorkspaceId(), stub.getActualWorkspaceId());
    }
  });
};

const interceptAuthentication = () => {
  // Intercept login request
  const alias = forgeAlias('reqAuth');
  cy.intercept({ method: 'POST', url: AUTH_QUERY_URL, middleware: true }, (req) => {
    req.continue((res) => {
      // Store data of the actual authenticated user
      if (stub.getActualAccessToken() === null) {
        const decodedAccessToken = authUtils.decodeJWT(res.body.access_token);
        // Several requests to the login service may match the regex. Make sure we store the access token that contains
        // the user roles
        if (decodedAccessToken.roles != null) {
          stub.setActualAccessToken('' + res.body.access_token);
        }
      }
      if (stub.getAuthenticatedUser() === null) {
        const user = authUtils.getUserFromToken(res.body.id_token);
        stub.setAuthenticatedUser(user);
      }
      if (!stub.isEnabledFor('AUTHENTICATION')) return res;

      // Use fake user if provided
      const fakeUser = stub.getFakeUser();
      if (fakeUser !== null) {
        res.body.id_token = authUtils.forgeIdTokenWithFakeUser(res.body.id_token, fakeUser);
      }
      // Use fake roles if provided
      const fakeRoles = stub.getFakeRoles();
      if (fakeRoles !== null) {
        res.body.access_token = authUtils.forgeAccessTokenWithFakeRoles(res.body.access_token, fakeRoles);
      }

      return res;
    });
  }).as(alias);
  return alias;
};

const interceptCreateScenario = () => {
  const alias = forgeAlias('reqCreateScenario');
  cy.intercept({ method: 'POST', url: API_REGEX.SCENARIOS, times: 1 }, (req) => {
    if (stub.isEnabledFor('CREATE_AND_DELETE_SCENARIO')) {
      const scenario = {
        ...SCENARIO_EXAMPLE,
        ...req.body,
        id: `s-${utils.randomStr(8)}`,
      };
      if (req.body.parentId) {
        // FIXME no stub data if GET_SCENARIOS disabled ?
        scenario.parametersValues = stub.getScenarioById(req.body.parentId).parametersValues;
      }

      if (stub.isEnabledFor('GET_SCENARIOS')) {
        const user = stub.getUser();
        const scenarioWithSecurity = {
          ...scenario,
          security: { default: 'none', accessControlList: [{ id: user.email, role: 'admin' }] },
        };
        stub.addScenario(scenarioWithSecurity);
      }
      req.reply(scenario);
    } else if (stub.isEnabledFor('GET_SCENARIOS')) {
      req.continue((res) => stub.addScenario(res.body));
    }
  }).as(alias);
  return alias;
};

// Parameter stubbingOptions must be an object or undefined.
// See doc of 'DEFAULT_SCENARIO_RUNS_OPTIONS' in 'stubbing' service file.
const interceptLaunchScenario = (stubbingOptions) => {
  const alias = forgeAlias('reqRunScenario');
  cy.intercept({ method: 'POST', url: API_REGEX.LAUNCH_SCENARIO, times: 1 }, (req) => {
    if (stub.isEnabledFor('LAUNCH_SCENARIO')) {
      const scenarioId = req.url.match(API_REGEX.LAUNCH_SCENARIO)[1];
      const runDuration = stubbingOptions?.runDuration ?? stub.getScenarioRunOptions().runDuration;
      const dataIngestionDuration =
        stubbingOptions?.dataIngestionDuration ?? stub.getScenarioRunOptions().dataIngestionDuration;
      const finalStatus = stubbingOptions?.finalStatus ?? stub.getScenarioRunOptions().finalStatus;

      const scenarioRun = {
        ...SCENARIO_RUN_EXAMPLE,
        id: `sr-stbd${utils.randomStr(6)}`,
      };
      stub.addScenarioRun(scenarioRun);

      const scenarioLastRun = {
        scenarioRunId: scenarioRun.id,
        csmSimulationRun: scenarioRun.csmSimulationRun,
        workflowId: scenarioRun.workflowId,
        workflowName: scenarioRun.workflowName,
      };
      stub.patchScenario(scenarioId, { state: 'Running', lastRun: scenarioLastRun });

      setTimeout(() => {
        stub.patchScenario(scenarioId, { state: 'DataIngestionInProgress' });
        setTimeout(() => {
          stub.patchScenario(scenarioId, { state: finalStatus });
        }, dataIngestionDuration);
      }, runDuration);

      req.reply(scenarioRun);
    }
  }).as(alias);
  return alias;
};

const interceptStopScenarioRun = (scenarioId) => {
  const alias = forgeAlias('reqStopScenarioRun');
  cy.intercept({ method: 'POST', url: API_REGEX.STOP_SCENARIO_RUN, times: 1 }, (req) => {
    if (stub.isEnabledFor('LAUNCH_SCENARIO')) {
      const scenarioRunId = req.url.match(API_REGEX.SCENARIO_RUN)[1];
      const scenarioLastRun = {
        id: scenarioRunId,
        endTime: null,
        message: null,
        estimatedDuration: null,
      };

      req.reply(scenarioLastRun);
    }
  }).as(alias);
  return alias;
};

const interceptGetScenarioRun = () => {
  const alias = forgeAlias('reqGetScenarioRun');
  cy.intercept({ method: 'GET', url: API_REGEX.SCENARIO_RUN, times: 1 }, (req) => {
    if (!stub.isEnabledFor('LAUNCH_SCENARIO')) return;
    const scenarioRunId = req.url.match(API_REGEX.SCENARIO_RUN)[1];
    req.reply(stub.getScenarioRunById(scenarioRunId));
  }).as(alias);
  return alias;
};

const interceptGetScenarioRunStatus = () => {
  const alias = forgeAlias('reqGetScenarioRunStatus');
  cy.intercept({ method: 'GET', url: API_REGEX.SCENARIO_RUN_STATUS, times: 1 }, (req) => {
    if (!stub.isEnabledFor('LAUNCH_SCENARIO')) return;
    const scenarioRunId = req.url.match(API_REGEX.SCENARIO_RUN_STATUS)[1];
    const runStatus = stub.getScenarioRunById(scenarioRunId).status;
    req.reply(runStatus);
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - scenarioId (optional): id of the scenario to update; if this option is not provided, the function will try to
//       detect the id from the query URL
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
//     - customScenarioPatch (optional): data to set in the request body, you can use this option to replace the
//       original content of the query
const interceptUpdateScenario = (options) => {
  const alias = forgeAlias('reqUpdateScenario');
  cy.intercept({ method: 'PATCH', url: API_REGEX.SCENARIO, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    const scenarioPatch = {
      lastUpdate: new Date().toISOString(),
      ...req.body,
      ...options?.customScenarioPatch,
    };
    const scenarioId = options?.scenarioId ?? req.url.match(API_REGEX.SCENARIO)[1];
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenario(scenarioId, scenarioPatch);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(scenarioPatch);
  }).as(alias);
  return alias;
};

const interceptUpdateScenarioDefaultSecurity = (expectedDefaultSecurity) => {
  const alias = forgeAlias('reqUpdateScenarioDefaultSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.SCENARIO_DEFAULT_SECURITY, times: 1 }, (req) => {
    const scenarioId = req.url.match(API_REGEX.SCENARIO_DEFAULT_SECURITY)[1];
    const newDefaultSecurity = req.body.role;
    if (expectedDefaultSecurity) expect(newDefaultSecurity).to.deep.equal(expectedDefaultSecurity);
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenarioDefaultSecurity(scenarioId, newDefaultSecurity);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(newDefaultSecurity);
  }).as(alias);
  return alias;
};

const interceptUpdateScenarioACLSecurity = (expectedACLSecurity) => {
  const alias = forgeAlias('reqUpdateScenarioACLSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.SCENARIO_SECURITY_ACL, times: 1 }, (req) => {
    const scenarioId = req.url.match(API_REGEX.SCENARIO_SECURITY_ACL)[1];
    const newACLSecurityItem = req.body;
    if (expectedACLSecurity) expect(newACLSecurityItem).to.deep.equal(expectedACLSecurity);
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenarioACLSecurity(scenarioId, newACLSecurityItem);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(newACLSecurityItem);
  }).as(alias);
  return alias;
};

// Parameters represent the expected numbers of requests to intercept & wwait for:
//  - defaultSecurityChangesCount: 0 or 1, number of requests to change the scenario security default role
//  - aclSecurityChangesCount: int >= 0, number of requests to change the scenario security ACL
const interceptUpdateScenarioSecurity = (defaultSecurityChangesCount, aclSecurityChangesCount) => {
  const aliases = [];
  if (defaultSecurityChangesCount > 0) aliases.push(interceptUpdateScenarioDefaultSecurity());
  for (let i = 0; i < aclSecurityChangesCount; ++i) {
    aliases.push(interceptUpdateScenarioACLSecurity());
  }
  return aliases;
};

const interceptGetOrganizationPermissions = () => {
  const alias = forgeAlias('reqGetOrganizationPermissions');
  cy.intercept({ method: 'GET', url: API_REGEX.PERMISSIONS_MAPPING }, (req) => {
    if (stub.isEnabledFor('PERMISSIONS_MAPPING')) req.reply(stub.getOrganizationPermissions());
  }).as(alias);
  return alias;
};

const interceptDeleteScenario = (scenarioName) => {
  const alias = forgeAlias('reqDeleteScenario');
  cy.intercept({ method: 'DELETE', url: API_REGEX.SCENARIO, times: 1 }, (req) => {
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.deleteScenarioByName(scenarioName);
    if (stub.isEnabledFor('CREATE_AND_DELETE_SCENARIO')) req.reply(req);
  }).as(alias);
  return alias;
};

const interceptGetScenario = (optionalScenarioId, times = 1) => {
  // Note: if optionalScenarioId is not provided, the interception may catch the wrong request (many requests use the
  // "scenario with id" endpoint, such as the polling requests); when using this interception, try to provide the
  // optionalScenarioId parameter if you can
  let interceptionURL = API_REGEX.SCENARIO;
  if (optionalScenarioId) {
    interceptionURL = new RegExp(
      '^' + API_ENDPOINT.WORKSPACES + '/((w|W)-[\\w]+)/scenarios/(' + optionalScenarioId + ')' + '$'
    );
  }

  const alias = forgeAlias('reqGetScenario');
  cy.intercept({ method: 'GET', url: interceptionURL, times }, (req) => {
    if (!stub.isEnabledFor('GET_SCENARIOS')) return;
    const scenarioId = optionalScenarioId ?? req.url.match(API_REGEX.SCENARIO)[1];
    req.reply(stub.getScenarioById(scenarioId));
  }).as(alias);
  return alias;
};

const interceptGetDatasets = () => {
  const alias = forgeAlias('reqGetDatasets');
  cy.intercept({ method: 'GET', url: API_REGEX.DATASETS, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_DATASETS')) return;
    req.reply(stub.getDatasets());
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - id (optional): id of the dataset to create
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
const interceptCreateDataset = (options) => {
  const alias = forgeAlias('reqCreateDataset');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASETS, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    if (stub.isEnabledFor('CREATE_DATASET')) {
      const dataset = {
        ...DEFAULT_DATASET,
        ...req.body,
        id: options.id ?? `d-stbd${utils.randomStr(4)}`,
      };

      if (stub.isEnabledFor('GET_DATASETS')) {
        stub.addDataset(dataset);
      }
      req.reply(dataset);
    } else if (stub.isEnabledFor('GET_DATASETS')) {
      req.continue((res) => stub.addDataset(res.body));
    }
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
//     - customDatasetPatch (optional): data to set in the request body, you can use this option to replace the original
//       content of the query
const interceptUpdateDataset = (options) => {
  const alias = forgeAlias('reqUpdateDataset');
  cy.intercept({ method: 'PATCH', url: API_REGEX.DATASET, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    const datasetPatch = {
      ...req.body,
      ...options?.customDatasetPatch,
    };
    // const datasetId = options?.datasetId ?? req.url.match(API_REGEX.DATASET)[1];
    const datasetId = req.url.match(API_REGEX.DATASET)[1];
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchDataset(datasetId, datasetPatch);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(datasetPatch);
  }).as(alias);
  return alias;
};

// Parameters:
//   - fileName: name (or path in Storage) of the uploaded file
//   - fileContent: content of the uploaded file
const interceptUploadWorkspaceFile = (fileName, fileContent) => {
  const alias = forgeAlias('reqUploadWorkspaceFile');
  cy.intercept({ method: 'POST', url: API_REGEX.FILE_UPLOAD, times: 1 }, (req) => {
    if (stub.isEnabledFor('CREATE_DATASET')) {
      stub.addWorkspaceFile(fileName, fileContent);
      req.reply(fileName);
    } else if (stub.isEnabledFor('GET_DATASETS')) {
      req.continue(() => stub.addWorkspaceFile(fileName, fileContent));
    }
  }).as(alias);
  return alias;
};

const interceptGetScenarios = () => {
  const alias = forgeAlias('reqGetScenarios');
  cy.intercept({ method: 'GET', url: API_REGEX.SCENARIOS, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_SCENARIOS')) return;
    req.reply(stub.getScenarios());
  }).as(alias);
  return alias;
};

const interceptGetOrganization = () => {
  const alias = forgeAlias('reqGetOrganization');
  cy.intercept({ method: 'GET', url: API_REGEX.ORGANIZATION, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_ORGANIZATION')) return;
    // TODO: when webapp supports multiple organizations, modify the line below to get the stubbed organization whose id
    // matches the id in the intercepted query URL, instead of using a default organization id
    req.reply(stub.getOrganizationById(stub.getDefaultOrganizationId()));
  }).as(alias);
  return alias;
};

const interceptGetWorkspaces = () => {
  const alias = forgeAlias('reqGetWorkspaces');
  cy.intercept({ method: 'GET', url: API_REGEX.WORKSPACES, times: 1 }, (req) => {
    if (stub.isEnabledFor('GET_WORKSPACES')) {
      req.reply(stub.getWorkspaces());
    } else {
      req.continue((res) => stub.setWorkspaces(res.body));
    }
  }).as(alias);
  return alias;
};

const interceptGetSolution = (solutionId) => {
  let interceptionURL = API_REGEX.SOLUTION;
  if (solutionId) {
    interceptionURL = new RegExp('^' + URL_ROOT + '/.*/solutions/(' + solutionId + ')' + '$');
  }
  const alias = forgeAlias('reqGetSolution');
  cy.intercept({ method: 'GET', url: interceptionURL, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_SOLUTIONS')) return;
    const solutionIdToGet = solutionId ?? req.url.match(interceptionURL)?.[1];
    req.reply(stub.getSolutionById(solutionIdToGet));
  }).as(alias);
  return alias;
};

const interceptPowerBIAzureFunction = () => {
  const alias = forgeAlias('reqPowerBI');
  cy.intercept('POST', URL_POWERBI, { statusCode: 200 }).as(alias);
  return alias;
};

const interceptWorkspaceSelectorQueries = () => {
  return [
    interceptGetOrganization(),
    interceptGetDatasets(),
    interceptGetOrganizationPermissions(),
    interceptGetWorkspaces(),
  ];
};

const interceptSelectWorkspaceQueries = () => {
  return [interceptPowerBIAzureFunction(), interceptGetScenarios(), interceptGetSolution()];
};

export const apiUtils = {
  forgeAlias,
  waitAlias,
  waitAliases,
  startInterceptionMiddlewares,
  interceptAuthentication,
  interceptCreateScenario,
  interceptLaunchScenario,
  interceptStopScenarioRun,
  interceptGetScenarioRun,
  interceptGetScenarioRunStatus,
  interceptUpdateScenario,
  interceptDeleteScenario,
  interceptGetDatasets,
  interceptCreateDataset,
  interceptUpdateDataset,
  interceptUploadWorkspaceFile,
  interceptGetOrganizationPermissions,
  interceptGetScenario,
  interceptGetScenarios,
  interceptGetSolution,
  interceptGetOrganization,
  interceptGetWorkspaces,
  interceptWorkspaceSelectorQueries,
  interceptSelectWorkspaceQueries,
  interceptPowerBIAzureFunction,
  interceptUpdateScenarioACLSecurity,
  interceptUpdateScenarioDefaultSecurity,
  interceptUpdateScenarioSecurity,
};
