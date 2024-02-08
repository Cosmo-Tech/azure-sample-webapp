// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { ScenarioManager, Scenarios, ScenarioParameters, Login, Workspaces } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { routeUtils as route } from '../../commons/utils';
import { EXTENDED_WORKSPACES_LIST } from '../../fixtures/stubbing/default';

describe('Discard and continue inside the same workspace', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
      PERMISSIONS_MAPPING: true,
    });
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('Check no message when change tab without modification', () => {
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });

  it('Check change tab when discard and continue after modification', () => {
    const currencyName = utils.randomStr(8);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);

    ScenarioManager.switchToScenarioManager();
    ScenarioParameters.discardAndContinue();
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });

  it('Check dont change tab when cancel discard and continue', () => {
    const currencyName = utils.randomStr(8);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);

    ScenarioManager.switchToScenarioManager();
    ScenarioParameters.cancelDiscardAndContinue();
    BreweryParameters.getCurrencyNameInput().should('value', currencyName);
  });

  it('Check change tab after discard modification', () => {
    const currencyName = utils.randomStr(8);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);
    ScenarioParameters.discard();

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });

  it('Check discard and continue on router goback', () => {
    const currencyName = utils.randomStr(8);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioManager.switchToScenarioManager();
    Scenarios.switchToScenarioView();
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);

    route.goBack();
    ScenarioParameters.discardAndContinue();
    ScenarioManager.getScenarioManagerView().should('be.visible');
  });
});

describe('Discard and continue go to workspaces', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
      PERMISSIONS_MAPPING: true,
    });
    stub.setWorkspaces(EXTENDED_WORKSPACES_LIST);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('Check no message when go to workspaces without modification', () => {
    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);

    Scenarios.getScenarioViewTab(60).should('be.visible');

    Workspaces.switchToWorkspaceView();
    Workspaces.getWorkspacesView().should('exist');
  });

  it('Check discard and continue when go to workspaces with modification', () => {
    const currencyName = utils.randomStr(8);

    Workspaces.getWorkspacesView().should('exist');
    Workspaces.selectWorkspace(EXTENDED_WORKSPACES_LIST[2].id);

    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToBasicTypesTab();
    BreweryParameters.getCurrencyUsedInput().check();
    BreweryParameters.getCurrencyNameInput().click().clear().type(currencyName);
    Workspaces.switchToWorkspaceView();

    ScenarioParameters.discardAndContinue();
    Workspaces.getWorkspacesView().should('exist');
  });
});
