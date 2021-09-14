// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  PAGE_NAME
} from '../../commons/TestConstants';
import { SELECTORS } from '../../commons/IdConstants';

describe('Log in & log out', () => {
  it('can redirect automaticaly when not log', () => {
    cy.visit('/');
    cy.url().should('include', PAGE_NAME.SIGN_IN);
  });

  it('can log in and log out', () => {
    cy.visit('/');
    cy.url().should('include', PAGE_NAME.SIGN_IN);
    // Login
    cy.visit(PAGE_NAME.SCENARIO);
    cy.login();

    // Logout
    cy.get(SELECTORS.userProfileMenu.menu).click();
    cy.get(SELECTORS.userProfileMenu.menu).should('be.visible');

    // TO DO
    // Found a solution to allow extern redirection and so handle logout
  });
});
