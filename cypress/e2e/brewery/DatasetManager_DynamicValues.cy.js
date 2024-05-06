// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Login, DatasetManager } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';
import {
  DATASETS,
  SOLUTION_WITH_DYNAMIC_VALUES,
  WORKSPACE,
  ORGANIZATION_WITH_DEFAULT_ROLE_USER,
} from '../../fixtures/stubbing/DatasetManager';

describe('Subdatasets creation', () => {
  before(() => {
    stub.start();
    stub.setOrganizations([ORGANIZATION_WITH_DEFAULT_ROLE_USER]);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_VALUES]);
    stub.setWorkspaces([WORKSPACE]);
    stub.setDatasets([...DATASETS]);
  });
  beforeEach(() => Login.login({ url: '/W-stbbdbrwryWithDM', workspaceId: 'W-stbbdbrwryWithDM' }));
  after(stub.stop);

  it('must show the parameter input fields associated to the selected data source', () => {
    const DATASET_A = DATASETS[0];
    const enumParameterSelector = '[data-cy=enum-input-select-etl_dynamic_values_enum_parameter]';
    const enumOption2Selector = '[data-cy="Dynamic value 2"]';
    const selectorForAllEnumOptions = '[data-cy^="Dynamic value"]';

    const validateRequest = (req) =>
      expect(req.body).to.deep.equal({ query: 'MATCH(n:Customer) RETURN n.id as customer_id' });
    const queryResponse = [
      { customer_id: 'Dynamic value 1' },
      { customer_id: 'Dynamic value 2' },
      { customer_id: 'Dynamic value 3' },
    ];

    DatasetManager.switchToDatasetManagerView();
    DatasetManager.selectDatasetById(DATASET_A.id);
    DatasetManager.startSubdatasetCreation();

    const waitForTwingraphQuery = DatasetManager.expectDatasetTwingraphQuery(queryResponse, validateRequest);
    DatasetManager.getDatasetCreationNextStep().click();
    DatasetManager.selectNewDatasetSourceType('dynamic_values_enum_filter');
    waitForTwingraphQuery();

    cy.get(enumParameterSelector).should('be.visible').click();
    cy.get(selectorForAllEnumOptions).should('have.length', 3);
    cy.get(enumOption2Selector).click();
  });
});
