import React from 'react';

describe ('Log in & log out with dev account', () => {
  it('can log in and log out', () => {
    // Login
    cy.visit('/sign-in')
    cy.contains("sign in", { matchCase: false })
    cy.contains("login with dev account", { matchCase: false })
      .click()
    // Open user profile menu
    cy.get('[data-cy=user-profile-menu]')
      .click()
    // Logout
    cy.get('[data-cy=logout]')
      .click()
    cy.contains("sign in", { matchCase: false })
  });
});
