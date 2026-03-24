// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, Scenarios } from '../../commons/actions';
import { RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';

describe('Scenario creation dialog', { keystrokeDelay: 1 }, () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('run templates are correctly filtered', () => {
    Scenarios.openScenarioCreationDialog();
    Scenarios.getScenarioCreationDialogRunTypeSelector().click();

    const visibleRunTemplates = [
      RUN_TEMPLATE.BREWERY_PARAMETERS,
      RUN_TEMPLATE.BASIC_TYPES,
      RUN_TEMPLATE.WITHOUT_PARAMETERS,
    ];
    for (const runTemplate of visibleRunTemplates) {
      Scenarios.getScenarioCreationDialogRunTypeSelectorOptions().contains(runTemplate).should('be.visible');
    }

    Scenarios.getScenarioCreationDialogRunTypeSelectorOptions().contains(RUN_TEMPLATE.HIDDEN).should('not.exist');
  });
});
