// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, ScenarioParameters, ScenarioSelector } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_SIMULATION_RUNNER, DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE } from '../../fixtures/stubbing/default';

const PARENT_PARAM = {
  id: 'forced_update_parent_param',
  labels: { en: 'Parent param', fr: 'Param parent' },
  varType: 'int',
  defaultValue: '10',
};

const CHILD_PARAM = {
  id: 'forced_update_child_param',
  labels: { en: 'Child param', fr: 'Param enfant' },
  varType: 'int',
  defaultValue: '5',
};

const PARENT_PARAM_GROUP = {
  id: 'forced_update_parent_group',
  labels: { en: 'Parent group', fr: 'Groupe parent' },
  parameters: [PARENT_PARAM.id],
};

const CHILD_PARAM_GROUP = {
  id: 'forced_update_child_group',
  labels: { en: 'Child group', fr: 'Groupe enfant' },
  parameters: [CHILD_PARAM.id],
};

const PARENT_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'forced_update_parent_rt',
  name: 'Run template with parent param',
  description: 'Run template with parent param',
  tags: ['forced_update_parent_rt'],
  parameterGroups: [PARENT_PARAM_GROUP.id],
};

const CHILD_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'forced_update_child_rt',
  name: 'Run template with child param',
  description: 'Run template with child param',
  tags: ['forced_update_child_rt'],
  parameterGroups: [CHILD_PARAM_GROUP.id],
};

// Extends the default solution with the custom parameters, groups and run templates used in these tests.
const SOLUTION_FOR_FORCED_UPDATE = {
  ...DEFAULT_SOLUTION,
  parameters: [...DEFAULT_SOLUTION.parameters, PARENT_PARAM, CHILD_PARAM],
  parameterGroups: [...DEFAULT_SOLUTION.parameterGroups, PARENT_PARAM_GROUP, CHILD_PARAM_GROUP],
  runTemplates: [...DEFAULT_SOLUTION.runTemplates, PARENT_RUN_TEMPLATE, CHILD_RUN_TEMPLATE],
};

const PARENT_RUNNER = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-forcedUpdateParent',
  name: 'Cypress_ForcedUpdate-RootSc.',
  runTemplateId: PARENT_RUN_TEMPLATE.id,
  runTemplateName: PARENT_RUN_TEMPLATE.name,
  parametersValues: [{ parameterId: PARENT_PARAM.id, varType: 'int', value: '10', isInherited: false }],
};

// Child scenario with a DIFFERENT run template from its parent.
// Its parametersValues only contains PARENT_PARAM (inherited from the parent), while CHILD_PARAM is absent.
// This triggers hasMissingRunTemplateParameters=true → forceUpdate=true → save must be called before launch.
const CHILD_RUNNER_DIFFERENT_RT = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-forcedUpdateChildDiff',
  name: 'Cypress_ForcedUpdate-ChildSc. (diff. RT)',
  parentId: PARENT_RUNNER.id,
  rootId: PARENT_RUNNER.id,
  runTemplateId: CHILD_RUN_TEMPLATE.id,
  runTemplateName: CHILD_RUN_TEMPLATE.name,
  parametersValues: [{ parameterId: PARENT_PARAM.id, varType: 'int', value: '10', isInherited: true }],
};

// Child scenario with the SAME run template as its parent.
// Its parametersValues contains PARENT_PARAM (inherited), which matches the run template's only parameter.
// This means hasMissingRunTemplateParameters=false → forceUpdate=false → save must NOT be called before launch.
const CHILD_RUNNER_SAME_RT = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-forcedUpdateChildSame',
  name: 'Cypress_ForcedUpdate-ChildSc. (same RT)',
  parentId: PARENT_RUNNER.id,
  rootId: PARENT_RUNNER.id,
  runTemplateId: PARENT_RUN_TEMPLATE.id,
  runTemplateName: PARENT_RUN_TEMPLATE.name,
  parametersValues: [{ parameterId: PARENT_PARAM.id, varType: 'int', value: '10', isInherited: true }],
};

const runOptions = { runDuration: 1000, finalStatus: 'Successful', expectedPollsCount: 2 };

describe('Scenario parameters forced update on launch', () => {
  before(() => stub.start());

  beforeEach(() => {
    Login.login();
    stub.setSolutions([SOLUTION_FOR_FORCED_UPDATE]);
    stub.setRunners([PARENT_RUNNER, CHILD_RUNNER_DIFFERENT_RT, CHILD_RUNNER_SAME_RT]);
  });

  afterEach(() => stub.reset());
  after(() => stub.stop());

  it('should trigger a save before launch when child scenario parameters are different from its run template', () => {
    const scenarioId = CHILD_RUNNER_DIFFERENT_RT.id;
    ScenarioSelector.selectScenario(CHILD_RUNNER_DIFFERENT_RT.name, scenarioId);
    ScenarioParameters.expandParametersAccordion();

    const validateRequest = (req) => {
      const savedParameterIds = req.body.parametersValues.map((pv) => pv.parameterId);
      expect(savedParameterIds).to.include(CHILD_PARAM.id);
      expect(savedParameterIds).not.to.include(PARENT_PARAM.id);
    };
    const runnerUpdateOptions = { scenarioId, validateRequest };
    ScenarioParameters.launch({ scenarioId, runOptions, saveAndLaunch: true, runnerUpdateOptions });
    ScenarioParameters.waitForScenarioRunEnd();
  });

  it('should NOT trigger a save before launch when child scenario parameters match its run template', () => {
    // Spy on PATCH calls to the runner update endpoint; the forced save must not occur.
    let saveWasCalled = false;
    cy.intercept({ method: 'PATCH', url: /\/runners\/(r|R)-\w+$/ }, (req) => {
      saveWasCalled = true;
      req.continue();
    });

    const scenarioId = CHILD_RUNNER_SAME_RT.id;
    ScenarioSelector.selectScenario(CHILD_RUNNER_SAME_RT.name, scenarioId);
    ScenarioParameters.expandParametersAccordion();
    ScenarioParameters.launch({ scenarioId, runOptions });
    ScenarioParameters.waitForScenarioRunEnd();

    cy.then(() => expect(saveWasCalled).to.be.false);
  });
});
