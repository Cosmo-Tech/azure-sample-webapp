// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import utils from '../../commons/TestUtils';
import { Login, ScenarioManager, Scenarios } from '../../commons/actions';
import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils';
import { SCENARIO_WITH_DESCRIPTION_AND_TAGS } from '../../fixtures/stubbing/DescriptionAndTags/scenarios';

describe('Scenario tags and description', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    stub.setScenarios([SCENARIO_WITH_DESCRIPTION_AND_TAGS]);
  });
  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });
  const scenarioId = SCENARIO_WITH_DESCRIPTION_AND_TAGS.id;
  const description = SCENARIO_WITH_DESCRIPTION_AND_TAGS.description;
  const tags = SCENARIO_WITH_DESCRIPTION_AND_TAGS.tags;
  it('can display and edit existing tags and description', () => {
    const newScenarioDescription = 'Edited scenario description';
    const validateDescriptionRequest = (req) =>
      expect(req.body).to.deep.equal({ description: newScenarioDescription, runTemplateId: '1' });
    const validateDeleteDescriptionRequest = (req) =>
      expect(req.body).to.deep.equal({ description: '', runTemplateId: '1' });

    const newScenarioTag = 'newTag';
    const newTagsList = [...tags, newScenarioTag];
    const validateTagsRequest = (req) => expect(req.body).to.deep.equal({ tags: newTagsList, runTemplateId: '1' });

    ScenarioManager.switchToScenarioManager();
    ScenarioManager.getScenarioAccordion(scenarioId).click();
    ScenarioManager.checkScenarioTagsChips(tags, scenarioId);
    ScenarioManager.saveScenarioTag(scenarioId, newScenarioTag, validateTagsRequest);
    newTagsList.forEach((tagToDelete, index) => {
      const tagsToDelete = newTagsList.slice(index + 1);
      const validateDeleteTagRequest = (req) =>
        expect(req.body).to.deep.equal({ tags: tagsToDelete, runTemplateId: '1' });
      ScenarioManager.deleteScenarioTag(scenarioId, 0, validateDeleteTagRequest);
    });
    ScenarioManager.checkScenarioTagsChips([], scenarioId);

    ScenarioManager.getScenarioAccordion(scenarioId).click();
    ScenarioManager.getScenarioDisabledDescription(scenarioId).should('be.visible');
    ScenarioManager.getScenarioDisabledDescription(scenarioId).should('have.text', description);
    // can edit the description but not save it if Esc button is pushed
    ScenarioManager.editScenarioDescription(scenarioId, newScenarioDescription);
    ScenarioManager.cancelMetadataEdition();
    ScenarioManager.getScenarioDisabledDescription(scenarioId).should('have.text', description);
    // save edition
    ScenarioManager.saveScenarioDescription(scenarioId, newScenarioDescription, validateDescriptionRequest);
    // delete description
    ScenarioManager.saveScenarioDescription(scenarioId, '', validateDeleteDescriptionRequest);
  });
  it('can create a scenario with tags and description', () => {
    const randomString = utils.randomStr(7);
    const scenarioName = 'Cypress tags and description - ' + randomString;
    const scenarioDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ';
    const scenarioTags = ['brewery', 'cypress', 'test'];
    Scenarios.createScenario(
      scenarioName,
      true,
      DATASET.BREWERY_ADT,
      RUN_TEMPLATE.BREWERY_PARAMETERS,
      scenarioDescription,
      scenarioTags
    ).then((response) => {
      const scenarioId = response.scenarioCreatedId;
      ScenarioManager.switchToScenarioManager();
      ScenarioManager.getScenarioAccordion(scenarioId).click();
      ScenarioManager.checkScenarioTagsChips(scenarioTags, scenarioId);
      ScenarioManager.getScenarioDisabledDescription(scenarioId).should('have.text', scenarioDescription);
    });
  });
});
