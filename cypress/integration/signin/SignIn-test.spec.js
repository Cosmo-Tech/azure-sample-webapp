// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { setAuthDataInLocalStorage } from "../../utils/auth/auth.js";

describe('Log in & log out', () => {
  it('can log in and log out with dev account', () => {
    // Login
    cy.visit('/');
    cy.url().should('include', '/sign-in');
    // cy.get('[data-cy=sign-in-with-dev-account-button]')
    //   .click();

    // logInWithAppSecret();
    cy.task('logInWithAppSecret')
    .then((authRes) => {
      setAuthDataInLocalStorage(authRes);
    });

    // cy.visit('/scenario');
    // cy.get('[data-cy=loading-component]').should('be.visible');
    // cy.url().should('include', '/scenario');
    // cy.get('[data-cy=user-profile-menu]')
    //   .click();
    // // Logout
    // cy.get('[data-cy=logout]')
    //   .click();
    // cy.url().should('include', '/sign-in');
  });
});
