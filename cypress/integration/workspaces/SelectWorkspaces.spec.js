// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Workspaces, Scenarios } from '../../commons/actions';
import { DEFAULT_WORKSPACES_LIST, EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

describe('Check workspaces features', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
    stub.start();
  });

  after(() => {
    stub.stop();
  });

  it('Can select one workspace then return to workspace selector by home button', () => {
    Login.loginWithoutWorkspace();
    Workspaces.getWorkspacesView();
    stub.getWorkspaces().forEach((workspace) => {
      Workspaces.getWorkspaceCardById(workspace.id).should('be.visible');
    });
    Workspaces.selectWorkspace(stub.getWorkspaces()[0].id);
    Scenarios.getScenarioViewTab(60).should('be.visible');

    Scenarios.getScenarioView().should('be.visible');
    Workspaces.getHomeButton().should('be.visible').click();
  });

  it('Check routing behavior with no workspace available', () => {
    stub.setWorkspaces([]);
    Login.loginWithoutWorkspace();
    Workspaces.getNoWorkspacePlaceholder().should('be.visible');
  });

  it('Check routing behavior with only one workspace available', () => {
    stub.setWorkspaces(DEFAULT_WORKSPACES_LIST);
    Login.loginWithoutWorkspace();

    Scenarios.getScenarioView().should('be.visible');
    Workspaces.getHomeButton().should('not.exist');
  });
});
