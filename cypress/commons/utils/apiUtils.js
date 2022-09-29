// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { API_REGEX, AUTH_QUERY_URL, URL_POWERBI, URL_ROOT } from '../constants/generic/TestConstants';
import { stub } from '../services/stubbing';
import { authUtils } from './authUtils';
import utils from '../../commons/TestUtils';
import { SCENARIO_EXAMPLE } from '../../fixtures/stubbing/default';

const forgeAlias = (prefix) => {
  if (typeof forgeAlias.requestIndex === 'undefined') {
    forgeAlias.requestIndex = 1;
  }
  return `${prefix}_${forgeAlias.requestIndex++}`;
};

const waitAlias = (alias, options) => {
  return cy.wait('@' + alias, options);
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
        id: `s-${utils.randomStr(3)}`,
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

const interceptUpdateScenario = (scenarioId) => {
  const alias = forgeAlias('reqUpdateScenario');
  cy.intercept({ method: 'PATCH', url: API_REGEX.SCENARIO, times: 1 }, (req) => {
    const scenarioPatch = req.body;
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenario(scenarioId, scenarioPatch);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(scenarioPatch);
  }).as(alias);
  return alias;
};

const interceptUpdateScenarioDefaultSecurity = () => {
  const alias = forgeAlias('reqUpdateScenarioDefaultSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.SCENARIO_DEFAULT_SECURITY, times: 1 }, (req) => {
    const scenarioId = req.url.match(API_REGEX.SCENARIO_ACL_SECURITY)[1];
    const newDefaultSecurity = req.body;
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenarioDefaultSecurity(scenarioId, newDefaultSecurity);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(newDefaultSecurity);
  }).as(alias);
  return alias;
};

const interceptUpdateScenarioACLSecurity = () => {
  const alias = forgeAlias('reqUpdateScenarioACLSecurity');
  cy.intercept({ method: 'POST', url: API_REGEX.SCENARIO_ACL_SECURITY, times: 1 }, (req) => {
    const scenarioId = req.url.match(API_REGEX.SCENARIO_ACL_SECURITY)[1];
    const newACLSecurity = req.body;
    if (stub.isEnabledFor('GET_SCENARIOS')) stub.patchScenarioACLSecurity(scenarioId, newACLSecurity);
    if (stub.isEnabledFor('UPDATE_SCENARIO')) req.reply(newACLSecurity);
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
  cy.intercept({ method: 'GET', url: API_REGEX.PERMISSIONS_MAPPING, times: 1 }, (req) => {
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

const interceptGetScenario = (scenarioId) => {
  // Note: if scenarioId is not provided, the interception may catch the wrong request (many requests use the
  // "scenario with id" endpoint, such as the polling requests); when using this interception, try to provide the
  // scenarioId parameter if you can
  let interceptionURL = API_REGEX.SCENARIO;
  if (scenarioId) {
    interceptionURL = new RegExp('^' + URL_ROOT + '/.*/scenarios/(' + scenarioId + ')' + '$');
  }
  const alias = forgeAlias('reqGetScenario');
  cy.intercept({ method: 'GET', url: interceptionURL, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_SCENARIOS')) return;
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

const interceptGetScenarios = () => {
  const alias = forgeAlias('reqGetScenarios');
  cy.intercept({ method: 'GET', url: API_REGEX.SCENARIOS, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_SCENARIOS')) return;
    req.reply(stub.getScenarios());
  }).as(alias);
  return alias;
};

const interceptGetWorkspace = (workspaceId) => {
  let interceptionURL = API_REGEX.WORKSPACE;
  if (workspaceId) {
    interceptionURL = new RegExp('^' + URL_ROOT + '/.*/workspaces/(' + workspaceId + ')' + '$');
  }
  const alias = forgeAlias('reqGetWorkspace');
  cy.intercept({ method: 'GET', url: interceptionURL, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_WORKSPACES')) return;
    let workspaceIdToGet = workspaceId;
    if (!workspaceIdToGet) workspaceIdToGet = stub.getFakeWorkspaceId() ?? req.url.match(interceptionURL)?.[1];
    req.reply(stub.getWorkspaceById(workspaceIdToGet));
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
  cy.intercept('GET', URL_POWERBI, { statusCode: 200 }).as(alias);
  return alias;
};

const interceptNewPageQueries = () => {
  return [
    interceptPowerBIAzureFunction(),
    interceptGetOrganizationPermissions(),
    interceptGetScenarios(),
    interceptGetDatasets(),
    interceptGetWorkspace(),
    interceptGetSolution(),
  ];
};

export const apiUtils = {
  forgeAlias,
  waitAlias,
  waitAliases,
  startInterceptionMiddlewares,
  interceptAuthentication,
  interceptCreateScenario,
  interceptUpdateScenario,
  interceptDeleteScenario,
  interceptGetDatasets,
  interceptGetOrganizationPermissions,
  interceptGetScenario,
  interceptGetScenarios,
  interceptGetSolution,
  interceptGetWorkspace,
  interceptNewPageQueries,
  interceptPowerBIAzureFunction,
  interceptUpdateScenarioACLSecurity,
  interceptUpdateScenarioDefaultSecurity,
  interceptUpdateScenarioSecurity,
};
