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

const interceptAuthentication = () => {
  // If authentication stubbing is enabled, add a middleware to reset the access token in requests to CosmoTech API
  // (required if it has been modified by stubbing roles, for instance)
  cy.intercept({ url: API_REGEX.ALL, middleware: true }, (req) => {
    if (stub.isEnabledFor('AUTHENTICATION') && stub.getActualAccessToken() !== null) {
      req.headers.authorization = 'Bearer ' + stub.getActualAccessToken();
    }
  });

  // Intercept login request
  const alias = forgeAlias('reqAuth');
  cy.intercept({ method: 'POST', url: AUTH_QUERY_URL, middleware: true }, (req) => {
    if (!stub.isEnabledFor('AUTHENTICATION')) return;
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

      if (stub.isEnabledFor('GET_SCENARIOS')) stub.addScenario(scenario);
      req.reply(scenario);
    } else if (stub.isEnabledFor('GET_SCENARIOS')) {
      req.continue((res) => stub.addScenario(res.body));
    }
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

const interceptGetScenarios = () => {
  const alias = forgeAlias('reqGetScenarios');
  cy.intercept({ method: 'GET', url: API_REGEX.SCENARIOS, times: 1 }, (req) => {
    if (!stub.isEnabledFor('GET_SCENARIOS')) return;
    req.reply(stub.getScenarios());
  }).as(alias);
  return alias;
};

const interceptPowerBIAzureFunction = () => {
  const alias = forgeAlias('reqPowerBI');
  cy.intercept('GET', URL_POWERBI, { statusCode: 200 }).as(alias);
  return alias;
};

export const apiUtils = {
  forgeAlias,
  waitAlias,
  interceptAuthentication,
  interceptCreateScenario,
  interceptDeleteScenario,
  interceptGetScenario,
  interceptGetScenarios,
  interceptPowerBIAzureFunction,
};
