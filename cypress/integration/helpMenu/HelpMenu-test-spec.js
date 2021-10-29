/* eslint-disable jest/expect-expect */
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AppBarMenu } from '../../commons/actions/generic/AppBarMenu';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';

describe('UserInfo features', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  it('can download the documentation PDF', () => {
    AppBarMenu.getHelpMenu();
    // Check that the link to the documentation PDF file exists
    AppBarMenu.getDocFileLinkSelector().should('have.attr', 'target', '_blank');
  });

  it('can go support page', () => {
    AppBarMenu.getHelpMenu();
    AppBarMenu.getSupportPageLink().should('have.attr', 'target', '_blank');
  });
});
