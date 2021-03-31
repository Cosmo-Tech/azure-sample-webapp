// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
describe('Log in & log out', () => {
  // eslint-disable-next-line jest/expect-expect
  it('can log in and log out with dev account', () => {
    // Login
    cy.visit('/')
    cy.url().should('include', '/sign-in')
    cy.get('[data-cy=log-with-dev-account-button]')
      .click()
    cy.url().should('include', '/digitaltwin')
    cy.get('[data-cy=user-profile-menu]')
      .click()
    // Logout
    cy.get('[data-cy=logout]')
      .click()
    cy.url().should('include', '/sign-in')
  })
})
