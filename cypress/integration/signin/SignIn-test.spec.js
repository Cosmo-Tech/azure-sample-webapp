// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';
import { GENERIC_SELECTORS as SELECTORS } from '../../commons/constants/generic/IdConstants';

describe('Redirection when not authenticated', () => {
  it('redirect automatically when not logged in', () => {
    cy.visit('/');
    cy.url().should('include', PAGE_NAME.SIGN_IN);
  });
});

describe('Log in & log out', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  it('can log in and log out', () => {
    // Logout
    cy.get(SELECTORS.userProfileMenu.menu).click();
    cy.get(SELECTORS.userProfileMenu.menu).should('be.visible');

    // TO DO
    // Find a solution to allow extern redirection and so handle logout
  });
});
