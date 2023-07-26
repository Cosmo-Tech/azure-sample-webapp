// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login, ScenarioParameters } from '../../commons/actions';
import {
  SCENARIOS,
  SOLUTIONS,
  SCENARIO_METADATA_PARAMETERS_IDS,
} from '../../fixtures/stubbing/ScenarioMetadataParameters';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';

const validateScenarioUpdateRequest = (req) => {
  expect(req.body.parametersValues.map((el) => el.parameterId)).to.include.members(SCENARIO_METADATA_PARAMETERS_IDS);
};

describe('scenario metadata parameters', () => {
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

  it('must always send scenario metadata when launching a scenario for the first time', () => {
    const scenarioId = SCENARIOS[0].id;
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
