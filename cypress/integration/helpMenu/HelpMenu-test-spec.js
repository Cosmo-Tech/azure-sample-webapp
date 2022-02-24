/* eslint-disable jest/expect-expect */
// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AppBar, Login } from '../../commons/actions';

describe('UserInfo features', () => {
  before(() => {
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  it('can go to documentation page', () => {
    AppBar.openHelpMenu();
    AppBar.getDocumentationLink().should('have.attr', 'target', '_blank');
  });

  it('can go support page', () => {
    AppBar.openHelpMenu();
    AppBar.getSupportPageLink().should('have.attr', 'target', '_blank');
  });

  it('can display About dialog', () => {
    AppBar.getAboutDialog().should('not.exist');
    AppBar.openHelpMenu();
    AppBar.openAboutDialog();
    AppBar.getAboutDialog().should('be.visible');
    AppBar.closeAboutDialog();
    AppBar.getAboutDialog().should('not.exist');
  });
});
