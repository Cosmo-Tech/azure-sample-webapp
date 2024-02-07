// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Scenarios, Workspaces } from '../actions/generic';
import { WEBAPP_URL_REGEX } from '../constants/generic/TestConstants';
import { stub } from '../services/stubbing';
import { apiUtils as api } from './apiUtils';

const _navigateTo = (url) => {
  cy.visit(url ?? '/', {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
};

const getBrowseQueries = (workspaceId, scenarioId) => {
  const queries = api.interceptWorkspaceSelectorQueries();
  if (workspaceId) queries.push(...api.interceptSelectWorkspaceQueries());
  if (scenarioId) queries.push(api.interceptGetScenario(scenarioId));
  return queries;
};

const waitBrowseQueries = (queries) => {
  api.waitAliases(queries, { timeout: 60 * 1000 });
};

// Parameters:
//   - options: dict with properties:
//     - url (mandatory): URL to navigate to
//     - workspaceId (optional): id of the workspace to open (required for interceptions when stubbing is enabled)
//     - scenarioId (optional): id of the scenario to open (required for interceptions when stubbing is enabled)
//     - onBrowseCallback (optional): callback function that will be called after setting the interceptions
//     - expectedURL (optional): can be set if expected URL after navigation is different from options.url (checked
//       with "include" assertion)
const browse = (options) => {
  if (!options?.url) {
    throw new Error('Target URL in browse function is undefined');
  }

  // Detect workspace id if not provided (and not explicitly null)
  const workspaces = stub.getWorkspaces();
  const workspaceId =
    options.workspaceId !== undefined
      ? options.workspaceId
      : stub.isEnabledFor('GET_WORKSPACES') && workspaces.length === 1
        ? workspaces[0].id // detect from stubbed workspace data
        : options.url?.match(WEBAPP_URL_REGEX.WORKSPACE)?.[0]; // detect from URL
  // Detect scenario id if not provided (and not explicitly null)
  const scenarioId =
    options.scenarioId !== undefined
      ? options.scenarioId
      : options.url?.match(WEBAPP_URL_REGEX.SCENARIO_ID_PATTERN)?.[1];

  // Intercept scenario only when explicitly specified in options (part 2 of WorkingInTwoWorkspaces)
  const queries = getBrowseQueries(workspaceId, options.scenarioId);
  _navigateTo(options.url);
  if (options.onBrowseCallback) options.onBrowseCallback();
  waitBrowseQueries(queries);

  // If workspace is known or scenario is specified, check we land on scenario view...
  if (workspaceId || scenarioId) {
    Scenarios.getScenarioViewTab(60).should('be.visible');
  } else {
    // ...otherwise, check we're still on workspaces selector
    Workspaces.getWorkspacesView(60).should('be.visible');
  }

  cy.url({ timeout: 5000 }).should('include', options.expectedURL ?? options.url);
};

const go = (direction, options) => {
  const aliases = [];
  if (options?.workspaceId) aliases.push(...api.interceptSelectWorkspaceQueries());
  if (options?.scenarioId) aliases.push(api.interceptGetScenario(options?.scenarioId));

  cy.go(direction);
  options?.workspaceId && cy.url({ timeout: 3000 }).should('include', `/${options?.workspaceId}`);
  options?.scenarioId && cy.url({ timeout: 3000 }).should('include', `/${options?.scenarioId}`);
  options?.expectedURL && cy.url({ timeout: 3000 }).should('include', options?.expectedURL);
  api.waitAliases(aliases);
};

const goBack = (options) => {
  go('back', options);
};

const goForward = (options) => {
  go('forward', options);
};

export const routeUtils = {
  browse,
  go,
  goBack,
  goForward,
  getBrowseQueries,
  waitBrowseQueries,
};
