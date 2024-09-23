// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AppBar, Login, Workspaces } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';

describe('UserInfo features', () => {
  before(() => {
    stub.start();
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
  });
  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
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
  it('can display Technical info dialog in Workspace and Scenario views', () => {
    AppBar.getTechnicalInfoDialog().should('not.exist');
    AppBar.openHelpMenu();
    AppBar.openTechnicalInfoDialog();
    AppBar.getTechnicalInfoDialog().should('be.visible');
    AppBar.getTechnicalInfoSolutionName().should('not.exist');
    AppBar.getTechnicalInfoSolutionDescription().should('not.exist');
    AppBar.closeTechnicalInfoDialog();
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[0].id);
    AppBar.getTechnicalInfoDialog().should('not.exist');
    AppBar.openHelpMenu();
    AppBar.openTechnicalInfoDialog();
    AppBar.getTechnicalInfoDialog().should('be.visible');
    AppBar.getTechnicalInfoSolutionName().should('be.visible');
    AppBar.getTechnicalInfoSolutionDescription().should('be.visible');
    AppBar.closeTechnicalInfoDialog();
  });
});
