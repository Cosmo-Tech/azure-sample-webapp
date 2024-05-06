// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { POLLING_START_DELAY } from '../../../src/services/config/FunctionalConstants';
import utils from '../../commons/TestUtils';
import {
  DEFAULT_DATASET,
  DEFAULT_RUNNER,
  SCENARIO_EXAMPLE,
  SCENARIO_RUN_EXAMPLE,
} from '../../fixtures/stubbing/default';
import { API_ENDPOINT, API_REGEX, AUTH_QUERY_URL, URL_POWERBI, URL_ROOT } from '../constants/generic/TestConstants';
import { stub } from '../services/stubbing';
import { authUtils } from './authUtils';
import { fileUtils } from './fileUtils';

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
        setTimeout(() => {
          stub.patchScenario(scenarioId, { state: 'DataIngestionInProgress' });
          setTimeout(() => {
            stub.patchScenario(scenarioId, { state: finalStatus });
          }, dataIngestionDuration);
        }, runDuration);
      }, POLLING_START_DELAY);

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
    const stubbedStartTime = stub.getScenarioRunOptions().startTime;
    if (stubbedStartTime !== undefined) runStatus.startTime = stubbedStartTime;
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

const interceptUpdateDatasetDefaultSecurity = (expectedDefaultSecurity) => {
  const alias = forgeAlias('reqUpdateDatasetDefaultSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_DEFAULT_SECURITY, times: 1 }, (req) => {
    const datasetId = req.url.match(API_REGEX.DATASET_DEFAULT_SECURITY)[1];
    const newDefaultSecurity = req.body.role;
    if (expectedDefaultSecurity) expect(newDefaultSecurity).to.deep.equal(expectedDefaultSecurity);
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchDatasetDefaultSecurity(datasetId, newDefaultSecurity);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newDefaultSecurity);
  }).as(alias);
  return alias;
};

const interceptUpdateDatasetACLSecurity = (expectedACLSecurity) => {
  const alias = forgeAlias('reqUpdateDatasetACLSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_SECURITY_ACL, times: 1 }, (req) => {
    const datasetId = req.url.match(API_REGEX.DATASET_SECURITY_ACL)[1];
    const newACLSecurityItem = req.body;
    if (expectedACLSecurity) expect(newACLSecurityItem).to.deep.equal(expectedACLSecurity);
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchDatasetACLSecurity(datasetId, newACLSecurityItem);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newACLSecurityItem);
  }).as(alias);
  return alias;
};

const interceptUpdateRunnerDefaultSecurity = (expectedDefaultSecurity) => {
  const alias = forgeAlias('reqUpdateRunnerDefaultSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.RUNNER_DEFAULT_SECURITY, times: 1 }, (req) => {
    const newDefaultSecurity = req.body.role;
    if (expectedDefaultSecurity) expect(newDefaultSecurity).to.deep.equal(expectedDefaultSecurity);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newDefaultSecurity);
  }).as(alias);
  return alias;
};

const interceptUpdateRunnerACLSecurity = (expectedACLSecurity) => {
  const alias = forgeAlias('reqUpdateRunnerACLSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.RUNNER_SECURITY_ACL, times: 1 }, (req) => {
    const newACLSecurityItem = req.body;
    if (expectedACLSecurity) expect(newACLSecurityItem).to.deep.equal(expectedACLSecurity);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newACLSecurityItem);
  }).as(alias);
  return alias;
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
    let workspaceId = 'w-dummywkspce';
    let scenarioId = req.url.match(interceptionURL)[1];
    if (optionalScenarioId) {
      // The 1st group is actually the workspace id with the regex used in this case
      workspaceId = req.url.match(interceptionURL)[1];
      scenarioId = optionalScenarioId ?? req.url.match(interceptionURL)[3];
    }
    const response = stub.getScenarioById(scenarioId) ?? {
      statusCode: 404,
      body: {
        title: 'Not Found',
        status: 404,
        detail: `Resource of type 'Scenario' not found with workspaceId=${workspaceId}, scenarioId=${scenarioId}`,
      },
    };
    req.reply(response);
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

const interceptGetDataset = () => {
  const alias = forgeAlias('reqGetDataset');
  cy.intercept({ method: 'GET', url: API_REGEX.DATASET, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_DATASETS')) return;
    const datasetId = req.url.match(API_REGEX.DATASET)?.[1];
    req.reply(stub.getDatasetById(datasetId));
  }).as(alias);
  return alias;
};

const interceptGetDatasetStatus = (times = 1) => {
  const alias = forgeAlias('reqGetDatasetStatus');
  cy.intercept({ method: 'GET', url: API_REGEX.DATASET_STATUS, times }, (req) => {
    const datasetId = req.url.match(API_REGEX.DATASET_STATUS)?.[1];
    if (stub.isEnabledFor('CREATE_DATASET')) {
      req.reply(stub.getDatasetById(datasetId).ingestionStatus);
    } else if (stub.isEnabledFor('GET_DATASETS')) {
      req.continue((res) => stub.patchDataset(datasetId, { ingestionStatus: res.body }));
    }
  }).as(alias);
  return alias;
};

// Parameters:
//   - response (optional): JSON response to the twingraph query that is simulated if stubbing is enabled. Example:
//       [{"id":"Dynamic value 1"},{"id":"Dynamic value 2"},{"id":"Dynamic value 3"}]
//   - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
const interceptPostDatasetTwingraphQuery = (response = {}, validateRequest) => {
  const alias = forgeAlias('reqPostDatasetTwingraphQuery');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_TWINGRAPH, times: 1 }, (req) => {
    if (validateRequest) validateRequest(req);
    if (!stub.isEnabledFor('GET_DATASETS')) return;
    req.reply(response);
  }).as(alias);
  return alias;
};

const interceptRollbackDatasetStatus = () => {
  const alias = forgeAlias('reqRollbackDatasetStatus');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_ROLLBACK, times: 1 }, (req) => {
    const datasetId = req.url.match(API_REGEX.DATASET_ROLLBACK)?.[1];
    if (stub.isEnabledFor('CREATE_DATASET')) {
      req.reply({ message: `Dataset ${datasetId} status is now SUCCESS` });
      stub.patchDataset(datasetId, { ingestionStatus: 'SUCCESS' });
    }
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - id (optional): id of the dataset to create
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
//     - customDatasetPatch (optional): data to set in the request body, you can use this option to replace the original
//       content of the query
//   - stubbingOptions (optional): must be an object or undefined (see doc of 'DEFAULT_DATASET_IMPORT_OPTIONS' in
//     'stubbing' service file).
const interceptCreateDataset = (options, stubbingOptions = stub.getDatasetImportOptions()) => {
  const alias = forgeAlias('reqCreateDataset');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASETS, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    const datasetId = options.id ?? `d-stbd${utils.randomStr(4)}`;
    if (stub.isEnabledFor('CREATE_DATASET')) {
      const dataset = {
        ...DEFAULT_DATASET,
        ...req.body,
        id: datasetId,
        ingestionStatus: 'PENDING',
        ...options?.customDatasetPatch,
      };

      stub.addDataset(dataset);
      setTimeout(() => {
        stub.patchDataset(datasetId, { ingestionStatus: stubbingOptions.finalIngestionStatus });
      }, stubbingOptions.importJobDuration);

      req.reply(dataset);
    } else if (stub.isEnabledFor('GET_DATASETS')) {
      req.continue((res) => stub.addDataset(res.body));
    }
  }).as(alias);
  return alias;
};

const interceptLinkDataset = () => {
  const alias = forgeAlias('reqLinkDataset');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_LINK, times: 1 }, (req) => {
    const regexResult = req.url.match(API_REGEX.DATASET_LINK);
    const datasetId = regexResult?.[1];
    if (stub.isEnabledFor('CREATE_DATASET') || stub.isEnabledFor('GET_DATASETS')) {
      // TODO: patch dataset in stubbing object to add linked workspace
      // const workspaceId = regexResult?.[3];
      req.reply(stub.getDatasetById(datasetId));
    }
  }).as(alias);
  return alias;
};

const interceptRefreshDataset = () => {
  const alias = forgeAlias('reqRefreshDataset');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_REFRESH, times: 1 }, (req) => {
    if (stub.isEnabledFor('CREATE_DATASET')) {
      const datasetId = req.url.match(API_REGEX.DATASET_REFRESH)?.[1];
      req.reply({
        jobId: 'gdi-stbdimportjob',
        datasetId,
        ingestionStatus: stub.getDatasetById(datasetId).ingestionStatus,
      });
    }
  }).as(alias);
  return alias;
};

const interceptRefreshDatasetAndPollStatus = (datasetId, options) => {
  const alias = forgeAlias('reqRefreshDatasetAndPollStatus');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_REFRESH, times: 1 }, (req) => {
    if (datasetId !== req.url.match(API_REGEX.DATASET_REFRESH)?.[1]) return;
    if (stub.isEnabledFor('CREATE_DATASET')) {
      stub.patchDataset(datasetId, { ingestionStatus: 'PENDING' });
      setTimeout(() => {
        stub.patchDataset(datasetId, {
          ingestionStatus: options.finalIngestionStatus,
        });
      }, 5000 * options.expectedPollsCount);

      req.reply({
        jobId: 'gdi-stbdimportjob',
        datasetId,
        status: 'PENDING',
      });
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
    const datasetId = req.url.match(API_REGEX.DATASET)?.[1];
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchDataset(datasetId, datasetPatch);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(datasetPatch);
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - id (optional): id of the dataset to create
//     - securityChanges (optional): object containing only the differences of security that are applied to the created
//      dataset. This object defines how queries must be intercepted when stubbing is enabled. The expected format
//      is the same as the security objects of API resources, with an additional field "type" with one of the values
//      "post", "patch", or "delete". Example:
//      {default: "viewer", accessControlList: [{id: "john.doe@example.com", role: "admin", type: "patch"}]}
const interceptUpdateDatasetSecurity = ({ datasetId, securityChanges }) => {
  const aliases = [];
  if (securityChanges?.default) aliases.push(interceptSetDatasetDefaultSecurity(datasetId, securityChanges?.default));
  securityChanges?.accessControlList?.forEach((entry) => {
    const type = entry.type;
    const aclEntry = { ...entry, type: undefined };

    if (type === 'post') aliases.push(interceptAddDatasetAccessControl(datasetId, aclEntry));
    else if (type === 'patch') aliases.push(interceptUpdateDatasetAccessControl(datasetId, aclEntry));
    else if (type === 'delete') aliases.push(interceptRemoveDatasetAccessControl(datasetId, aclEntry));
    else console.warn(`Unknown ACL entry type "${type}" in interceptUpdateDatasetSecurity`);
  });
  return aliases;
};

const interceptAddDatasetAccessControl = (optionalDatasetId, expectedNewEntry) => {
  const alias = forgeAlias('reqAddDatasetAccessControl');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_SECURITY_ACL, times: 1 }, (req) => {
    const datasetId = optionalDatasetId ?? req.url.match(API_REGEX.DATASET_SECURITY_ACL)[1];
    const newEntry = req.body;
    if (expectedNewEntry) expect(newEntry).to.deep.equal(expectedNewEntry);
    if (stub.isEnabledFor('GET_DATASETS')) stub.addDatasetAccessControl(datasetId, newEntry);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newEntry);
  }).as(alias);
  return alias;
};

const interceptUpdateDatasetAccessControl = (optionalDatasetId, expectedUpdatedEntry) => {
  const alias = forgeAlias('reqUpdateDatasetAccessControl');
  cy.intercept({ method: 'PATCH', url: API_REGEX.DATASET_SECURITY_ACL, times: 1 }, (req) => {
    const datasetId = optionalDatasetId ?? req.url.match(API_REGEX.DATASET_SECURITY_USER_ACCESS)[1];
    const newAccess = { id: req.url.match(API_REGEX.DATASET_SECURITY_USER_ACCESS)[2], role: req.body.role };
    if (expectedUpdatedEntry) expect(newAccess).to.deep.equal(expectedUpdatedEntry);
    if (stub.isEnabledFor('GET_DATASETS')) stub.updateDatasetAccessControl(datasetId, newAccess);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newAccess);
  }).as(alias);
  return alias;
};

const interceptRemoveDatasetAccessControl = (optionalDatasetId, expectedIdToRemove) => {
  const alias = forgeAlias('reqRemoveDatasetAccessControl');
  cy.intercept({ method: 'DELETE', url: API_REGEX.DATASET_SECURITY_ACL, times: 1 }, (req) => {
    const datasetId = optionalDatasetId ?? req.url.match(API_REGEX.DATASET_SECURITY_USER_ACCESS)[1];
    const userId = req.url.match(API_REGEX.DATASET_SECURITY_USER_ACCESS)[2];
    if (expectedIdToRemove) expect(userId).to.equal(expectedIdToRemove);
    if (stub.isEnabledFor('GET_DATASETS')) stub.removeDatasetAccessControl(datasetId, userId);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply();
  }).as(alias);
  return alias;
};

const interceptSetDatasetDefaultSecurity = (optionalDatasetId, expectedDefaultSecurity) => {
  const alias = forgeAlias('reqSetDatasetDefaultSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.DATASET_DEFAULT_SECURITY, times: 1 }, (req) => {
    const datasetId = optionalDatasetId ?? req.url.match(API_REGEX.DATASET_DEFAULT_SECURITY)[1];
    const newDefaultSecurity = req.body.role;
    if (expectedDefaultSecurity) expect(newDefaultSecurity).to.deep.equal(expectedDefaultSecurity);
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchDatasetDefaultSecurity(datasetId, newDefaultSecurity);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(newDefaultSecurity);
  }).as(alias);
  return alias;
};

const interceptDeleteDataset = (datasetName) => {
  const alias = forgeAlias('reqDeleteDataset');
  cy.intercept({ method: 'DELETE', url: API_REGEX.DATASET, times: 1 }, (req) => {
    if (stub.isEnabledFor('CREATE_DATASET')) {
      stub.deleteDatasetByName(datasetName);
      req.reply(req);
    }
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - id (optional): id of the runner to create
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
//     - customRunnerPatch (optional): data to set in the request body, you can use this option to replace the original
//       content of the query
const interceptCreateRunner = (options = {}) => {
  const alias = forgeAlias('reqCreateRunner');
  cy.intercept({ method: 'POST', url: API_REGEX.RUNNERS, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    const runnerId = options.id ?? `r-stbd${utils.randomStr(4)}`;
    if (stub.isEnabledFor('CREATE_DATASET')) {
      const runner = {
        ...DEFAULT_RUNNER,
        ...req.body,
        id: runnerId,
        security: { default: 'none', accessControlList: [{ id: stub.getUser().email, role: 'admin' }] },
        ...options?.customRunnerPatch,
      };

      stub.addRunner(runner);
      req.reply(runner);
    } else if (stub.isEnabledFor('GET_DATASETS')) {
      req.continue((res) => stub.addRunner(res.body));
    }
  }).as(alias);
  return alias;
};

// Parameters:
//   - options: dict with properties:
//     - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
//     - customRunnerPatch (optional): data to set in the request body, you can use this option to replace the original
//       content of the query
const interceptUpdateRunner = (options = {}) => {
  const alias = forgeAlias('reqUpdateRunner');
  cy.intercept({ method: 'PATCH', url: API_REGEX.RUNNER, times: 1 }, (req) => {
    if (options?.validateRequest) options?.validateRequest(req);
    const runnerPatch = {
      ...req.body,
      ...options?.customRunnerPatch,
    };
    const runnerId = req.url.match(API_REGEX.RUNNER)?.[1];
    if (stub.isEnabledFor('GET_DATASETS')) stub.patchRunner(runnerId, runnerPatch);
    if (stub.isEnabledFor('UPDATE_DATASET')) req.reply(runnerPatch);
  }).as(alias);
  return alias;
};

const interceptDownloadWorkspaceFile = () => {
  const alias = forgeAlias('reqDownloadWorkspaceFile');
  cy.intercept({ method: 'GET', url: API_REGEX.FILE_DOWNLOAD, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_DATASETS')) return;
    const fileName = decodeURIComponent(req.url.match(API_REGEX.FILE_DOWNLOAD)?.[1]);
    req.reply(stub.getWorkspaceFile(fileName));
  }).as(alias);
  return alias;
};

// Parameters:
//   - fileName: name (or path in Storage) of the uploaded file
//   - fileContent: content of the uploaded file
const interceptUploadWorkspaceFile = () => {
  const alias = forgeAlias('reqUploadWorkspaceFile');
  cy.intercept({ method: 'POST', url: API_REGEX.FILE_UPLOAD, times: 1 }, (req) => {
    const form = fileUtils.parseMultipartFormData(req.body);
    const fileName = form.destination;
    const fileContent = form.file;
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
  return [interceptPowerBIAzureFunction(), interceptGetSolution(), interceptGetScenarios()];
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
  interceptGetDataset,
  interceptGetDatasetStatus,
  interceptPostDatasetTwingraphQuery,
  interceptRollbackDatasetStatus,
  interceptCreateDataset,
  interceptLinkDataset,
  interceptRefreshDataset,
  interceptRefreshDatasetAndPollStatus,
  interceptUpdateDataset,
  interceptUpdateDatasetSecurity,
  interceptAddDatasetAccessControl,
  interceptUpdateDatasetAccessControl,
  interceptRemoveDatasetAccessControl,
  interceptSetDatasetDefaultSecurity,
  interceptDeleteDataset,
  interceptCreateRunner,
  interceptUpdateRunner,
  interceptDownloadWorkspaceFile,
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
  interceptUpdateDatasetDefaultSecurity,
  interceptUpdateDatasetACLSecurity,
  interceptUpdateRunnerDefaultSecurity,
  interceptUpdateRunnerACLSecurity,
};
