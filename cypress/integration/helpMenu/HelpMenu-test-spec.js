/* eslint-disable jest/expect-expect */
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AppBar } from '../../commons/actions/generic/AppBar';

describe('UserInfo features', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  it('can download the documentation PDF', () => {
    AppBar.openHelpMenu();
    // Check that the link to the documentation PDF file exists
    AppBar.getDocumentationLink().should('have.attr', 'target', '_blank');
  });

  it('can go support page', () => {
    AppBar.openHelpMenu();
    AppBar.getSupportPageLink().should('have.attr', 'target', '_blank');
  });
});
