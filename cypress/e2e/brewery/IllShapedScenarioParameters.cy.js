// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { SCENARIOS, SOLUTIONS } from '../../fixtures/stubbing/IllShapedScenarioParameters';

describe('scenario parameter values without varType are supported if described in the solution', () => {
  before(() => {
    stub.start();
    stub.setSolutions(SOLUTIONS);
    stub.setScenarios(SCENARIOS);
  });

  beforeEach(() => {
    Login.login();
  });

  it('should detect missing varType in date parameter and use the varType in solution as a backup', () => {
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getStartDateInput().should('have.value', '01/01/2021');
    BreweryParameters.getStartDateInput().clear();
    BreweryParameters.getStartDateInput().type('22/22/2222');
    BreweryParameters.getStartDateInput().should('have.value', '22/22/2222');
    ScenarioParameters.discard();
    BreweryParameters.getStartDateInput().should('have.value', '01/01/2021');
  });
});
