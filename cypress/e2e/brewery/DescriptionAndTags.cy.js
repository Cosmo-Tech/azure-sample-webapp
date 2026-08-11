// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Login, ScenarioManager, Scenarios } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import { DEFAULT_DATASETS, DEFAULT_SIMULATION_RUNNER, DEFAULT_SOLUTION } from '../../fixtures/stubbing/default';

const SCENARIO_WITH_DESCRIPTION_AND_TAGS = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-stubbedrnnr01',
  name: '1 - Scenario with tags',
  runTemplateId: 'sim_brewery_parameters',
  tags: ['brewery', 'tag', 'cypress'],
  description: 'A short description of a scenario to easily keep track of its purpose',
};
const expectedPayload = {
  name: SCENARIO_WITH_DESCRIPTION_AND_TAGS.name,
  description: SCENARIO_WITH_DESCRIPTION_AND_TAGS.description,
  tags: SCENARIO_WITH_DESCRIPTION_AND_TAGS.tags,
};

const forgeValidationRequest = (changesToExpectedPayload) => (req) =>
  expect(req.body).to.deep.equal({ ...expectedPayload, ...changesToExpectedPayload });

describe('Scenario tags and description', { keystrokeDelay: 1 }, () => {
  before(() => {
    stub.start();
    stub.setDatasets(DEFAULT_DATASETS);
    stub.setRunners([SCENARIO_WITH_DESCRIPTION_AND_TAGS]);
  });
  beforeEach(() => Login.login());
  after(() => stub.stop());

  it('can display and edit the tags & description of an existing scenario', () => {
    const scenarioId = SCENARIO_WITH_DESCRIPTION_AND_TAGS.id;
    const tags = SCENARIO_WITH_DESCRIPTION_AND_TAGS.tags; // Initial tags: ['brewery', 'tag', 'cypress']
    ScenarioManager.switchToScenarioManager();
    ScenarioManager.checkScenarioTagsChips(scenarioId, tags);

    // Set tags to ['brewery', 'tag', 'cypress', 'newTag']
    const newScenarioTag = 'newTag';
    const newTagsList = [...tags, newScenarioTag];
    ScenarioManager.addScenarioTag(scenarioId, newScenarioTag, forgeValidationRequest({ tags: newTagsList }));
    // Set tags to ['brewery', 'tag', 'newTag']
    ScenarioManager.deleteScenarioTag(scenarioId, 2, forgeValidationRequest({ tags: ['brewery', 'tag', 'newTag'] }));
    // Clear all three remaining tags & confirm changes
    ScenarioManager.openScenarioEditDialog(scenarioId);
    ScenarioManager.deleteEditedScenarioTag(0);
    ScenarioManager.deleteEditedScenarioTag(0);
    ScenarioManager.deleteEditedScenarioTag(0);
    ScenarioManager.confirmScenarioEdition({ validateRequest: forgeValidationRequest({ tags: [] }) });
    ScenarioManager.checkScenarioTagsChips(scenarioId, []);

    const description = SCENARIO_WITH_DESCRIPTION_AND_TAGS.description;
    ScenarioManager.checkScenarioDescription(scenarioId, description);

    // Edit description & cancel changes
    const newScenarioDescription = 'Edited scenario description';
    ScenarioManager.openScenarioEditDialog(scenarioId);
    ScenarioManager.setEditedScenarioDescription(newScenarioDescription);
    ScenarioManager.cancelScenarioEdition();
    ScenarioManager.checkScenarioDescription(scenarioId, description);

    // Save new description
    const validateNewDescriptionRequest = forgeValidationRequest({ description: newScenarioDescription, tags: [] });
    ScenarioManager.editScenarioDescription(scenarioId, newScenarioDescription, validateNewDescriptionRequest);
    // Delete description and check it's empty
    const validateDeleteDescriptionRequest = forgeValidationRequest({ description: '', tags: [] });
    ScenarioManager.editScenarioDescription(scenarioId, '', validateDeleteDescriptionRequest);
  });

  it('correctly shows the tags & description of a newly created scenario', () => {
    const randomString = utils.randomStr(7);
    const scenarioName = 'Cypress tags and description - ' + randomString;
    const scenarioDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ';
    const scenarioTags = ['brewery', 'cypress', 'test'];
    Scenarios.createScenario(
      scenarioName,
      true,
      DEFAULT_DATASETS[0].name,
      DEFAULT_SOLUTION.runTemplates[0].name,
      scenarioDescription,
      scenarioTags
    ).then((response) => {
      const scenarioId = response.scenarioCreatedId;
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.checkScenarioTagsChips(scenarioId, scenarioTags);
      ScenarioManager.hoverScenarioInfoIcon(scenarioId);
      ScenarioManager.getScenarioDescription().should('have.text', scenarioDescription);
      ScenarioManager.closeScenarioInfoTooltip(scenarioId);
    });
  });
});
