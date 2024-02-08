// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Workspaces, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_WORKSPACES_LIST, EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';

describe('Check workspaces features', () => {
  before(() => {
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
    stub.start();
  });

  after(() => {
    stub.stop();
  });

  it('Can select one workspace then return to workspace selector by home button', () => {
    Login.login();
    Workspaces.getWorkspacesView();
    stub.getWorkspaces().forEach((workspace) => {
      Workspaces.getWorkspaceCardById(workspace.id).should('be.visible');
    });
    Workspaces.selectWorkspace(stub.getWorkspaces()[0].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    Scenarios.getScenarioView().should('be.visible');
    Workspaces.getWorkspaceInfoAvatar().click();
    Workspaces.getWorkspaceInfoPopover().should('exist');
    Workspaces.getWorkspaceInfoName().should('have.text', EXTENDED_WORKSPACES_LIST[0].name);
    Workspaces.getWorkspaceInfoDescription().should('have.text', EXTENDED_WORKSPACES_LIST[0].description);
    Workspaces.getSwitchWorkspaceButton().click();
    Workspaces.getWorkspacesView();
  });

  it('Check routing behavior with no workspace available', () => {
    stub.setWorkspaces([]);
    Login.login();
    Workspaces.getNoWorkspacePlaceholder().should('be.visible');
  });

  it('Check routing behavior with only one workspace available', () => {
    stub.setWorkspaces(DEFAULT_WORKSPACES_LIST);
    Login.login();

    Scenarios.getScenarioView().should('be.visible');
    Workspaces.getWorkspaceInfoAvatar().should('not.exist');
  });
  it('Shares a workspace with a link', () => {
    Login.login({ url: 'W-stbbdbrwry', expectedURL: 'W-stbbdbrwry/scenario' });
    Scenarios.getScenarioView().should('be.visible');
  });
});
