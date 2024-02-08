// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import {
  SCENARIOS,
  SOLUTIONS,
  SCENARIO_METADATA_PARAMETERS_IDS,
} from '../../fixtures/stubbing/ScenarioMetadataParameters';

const validateScenarioUpdateRequest = (req) => {
  expect(req.body.parametersValues.map((el) => el.parameterId)).to.include.members(SCENARIO_METADATA_PARAMETERS_IDS);
};

describe('scenario metadata parameters', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_ORGANIZATION: true,
      GET_SOLUTIONS: true,
      UPDATE_SCENARIO: true,
      LAUNCH_SCENARIO: true,
    });
    stub.setScenarios(SCENARIOS);
    stub.setSolutions(SOLUTIONS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('must always send scenario metadata when launching a scenario for the first time', () => {
    const scenarioId = SCENARIOS[0].id;
    const scenarioName = SCENARIOS[0].name;
    ScenarioSelector.selectScenario(scenarioName, scenarioId);
    // Check scenario metadata parameters (declared with hidden=true) are not visible
    ScenarioParameters.expandParametersAccordion();
    SCENARIO_METADATA_PARAMETERS_IDS.forEach((parameterId) =>
      ScenarioParameters.getParameterContainer(`text-input-${parameterId}`).should('not.exist')
    );
    ScenarioParameters.getParameterContainer('number-input-stock').should('be.visible');

    // Check values of scenario metadata parameters are sent even when clicking on the "Launch" button (without saving)
    const scenarioSaveAlias = apiUtils.interceptUpdateScenario({
      scenarioId,
      validateRequest: validateScenarioUpdateRequest,
    });
    ScenarioParameters.launch();
    apiUtils.waitAliases([scenarioSaveAlias]);
  });
});

describe('hidden scenario parameters', () => {
  before(() => {
    stub.start({
      GET_DATASETS: true,
      GET_SCENARIOS: true,
      GET_WORKSPACES: true,
      GET_SOLUTIONS: true,
      UPDATE_SCENARIO: true,
      LAUNCH_SCENARIO: true,
    });
    stub.setScenarios(SCENARIOS);
    stub.setSolutions(SOLUTIONS);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('must not show hidden groups of parameters', () => {
    ScenarioParameters.expandParametersAccordion();
    // Tabs container must contain only 1 div: the "no parameters" placeholder
    ScenarioParameters.getParametersTabs().find('div').should('have.length', 1);
    ScenarioParameters.getNoParametersPlaceholder().should('be.visible');
  });
});
