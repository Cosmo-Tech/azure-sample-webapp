// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AppBar, Login } from '../../commons/actions';
import { BREWERY_WORKSPACE_ID } from '../../commons/constants/brewery/TestConstants';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';

describe('Redirection when not authenticated', () => {
  it('redirect automatically when not logged in', () => {
    cy.visit('/');
    cy.url().should('include', PAGE_NAME.SIGN_IN);
  });
});

describe('Log in & log out', () => {
  before(() => {});

  beforeEach(() => {
    Login.login({ workspaceId: BREWERY_WORKSPACE_ID, url: `/${BREWERY_WORKSPACE_ID}` });
  });

  it('can log in and log out', () => {
    // Logout
    AppBar.openUserInfoMenu();
    AppBar.getLogoutButton().should('be.visible');

    // TO DO
    // Find a solution to allow extern redirection and so handle logout
  });
});
