// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import 'cypress-localstorage-commands';
import { USER_EXAMPLE } from '../../../fixtures/stubbing/default/users';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { stub } from '../../services/stubbing';
import { apiUtils as api, authUtils as auth, routeUtils as route } from '../../utils';
import { setup } from '../../utils/setup';

const BASE_URL = Cypress.config().baseUrl;

function getDevLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.devLoginButton);
}

function getMicrosoftLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.microsoftLoginButton);
}

// Parameters:
//   - options: dict with properties:
//     - url (optional): URL to navigate to after login
//     - workspaceId (optional): id of the workspace to open (required for interceptions when stubbing is enabled)
//     - scenarioId (optional): id of the scenario to open (required for interceptions when stubbing is enabled)
//     - noInterceptionMiddlewares (optional): if true, then middleware interception for authentication and workspace
//       won't be set (default=false)
//     - onBrowseCallback (optional): callback function that will be called after setting the interceptions
//     - expectedURL (optional): can be set if expected URL after navigation is different from options.url (checked
//       with "include" assertion)
function login(options) {
  Cypress.session.clearAllSavedSessions();
  cy.session(
    ['defaultLogin', cy.id],
    () => {
      setup.initCypressAndStubbing({ noInterceptionMiddlewares: options?.noInterceptionMiddlewares });
      cy.clearLocalStorageSnapshot();

      let reqAuthAlias;
      let browseCallback;
      if (auth.USE_SERVICE_ACCOUNT || auth.USE_API_KEY) {
        // Note: login with the "dev" login button will only work if the access_token is already set in local storage
        stub.setFakeUser(USER_EXAMPLE);
        if (auth.USE_API_KEY) {
          browseCallback = () => Login.getDevLoginButton().click();
        }
      } else {
        reqAuthAlias = api.interceptAuthentication();
        browseCallback = () => Login.getMicrosoftLoginButton().click();
      }

      route.browse({ url: BASE_URL, onBrowseCallback: browseCallback, ...options });
      api.waitAlias(reqAuthAlias, { timeout: 60 * 1000 });
      cy.url().should('not.contain', '/sign-in');
      cy.url().should('not.contain', '/denied');
    },
    {
      validate() {
        if (auth.USE_API_KEY) return;

        cy.getAllLocalStorage().then((localStorage) => {
          // Can't use `Cypress.config('baseUrl')` below, because when deployed, the webapp base URL can include
          // a subpath after the domain name (e.g. "/cosmotech-webapp/brewery"), that is not present in the local
          // storage key
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          expect(localStorage[baseUrl].authProvider).not.to.eq(undefined);
          expect(localStorage[baseUrl].authAccessToken).not.to.eq(undefined);
        });
      },
    }
  );
  route.browse({ url: BASE_URL, ...options });
}

export const Login = {
  getDevLoginButton,
  getMicrosoftLoginButton,
  login,
};
