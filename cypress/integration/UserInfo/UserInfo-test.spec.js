// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

describe('UserInfo features', () => {
  it('can log in with dev account', () => {
    cy.visit('/');
    cy.url().should('include', '/sign-in');
    cy.get('[data-cy=sign-in-with-dev-account-button]').click();
    cy.url().should('include', '/scenario');
  });

  it('can download the documentation PDF', () => {
    cy.get('[data-cy=user-profile-menu]').click();
    // Check that the link to the documentation PDF file exists
    cy.get('a[href="doc.pdf"]')
      .should('have.attr', 'target', '_blank');
  });

  it('can change the application language', () => {
    cy.get('[data-cy=user-profile-menu]').click();
    cy.get('[data-cy=change-language]').click();
    cy.get('[data-cy=set-lang-fr]').click().should(() => {
      expect(localStorage.getItem('locale')).to.eq('fr');
    });
    cy.get('[data-cy=set-lang-en]').click().should(() => {
      expect(localStorage.getItem('locale')).to.eq('en');
    });
  });

  it('can log out', () => {
    cy.get('[data-cy=user-profile-menu]').click();
    cy.get('[data-cy=logout]').click();
    cy.url().should('include', '/sign-in');
  });
});
