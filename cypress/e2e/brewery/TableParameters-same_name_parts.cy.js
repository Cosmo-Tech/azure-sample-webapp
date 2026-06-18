// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { Login, ScenarioParameters, Scenarios } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import { stub } from '../../commons/services/stubbing';
import { apiUtils } from '../../commons/utils';
import { DATASETS } from '../../fixtures/stubbing/ScenarioParameters/datasets';
import { SOLUTION_WITH_DYNAMIC_TABLE } from '../../fixtures/stubbing/TableParameters-dynamic_table/solution';
import { BASIC_PARAMETERS_SIMULATION_RUNNER } from '../../fixtures/stubbing/default';

const clone = rfdc();

const queryResponse =
  'name,satisfaction,surroundingSatisfaction,thirsty\n' +
  'Customer3,0,0,false\n' +
  'Customer1,0,0,false\n' +
  'Customer2,0,0,false\n' +
  'Customer4,0,0,false';
const firstCustomerName = 'Customer3';

describe('dynamic table selects DB part when duplicate names exist', () => {
  before(() => {
    const modifiedDatasets = clone(DATASETS);
    const targetDataset = modifiedDatasets.find((d) => (d.parts ?? []).some((p) => p.name === 'customers'));
    if (targetDataset) {
      const newFileDatasetPart = {
        id: 'dp-customers-file',
        name: 'customers',
        type: 'File',
        organizationId: targetDataset.organizationId,
        workspaceId: targetDataset.workspaceId,
        datasetId: targetDataset.id,
        sourceName: 'customers.csv',
      };
      targetDataset.parts = [newFileDatasetPart, ...targetDataset.parts];
    }

    stub.start();
    stub.setDatasets(modifiedDatasets);
    stub.setRunners([BASIC_PARAMETERS_SIMULATION_RUNNER]);
    stub.setSolutions([SOLUTION_WITH_DYNAMIC_TABLE]);
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  const validateRequest = (req) => {
    expect(req.url).to.include('dp-customers');
    expect(req.url).not.to.include('dp-customers-file');
  };

  it('uses the DB dataset part when both File and DB parts share the same name', () => {
    apiUtils.interceptPostDatasetTwingraphQuery(queryResponse, validateRequest);
    Scenarios.getScenarioViewTab(60).should('be.visible');
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.switchToCustomersTab();
    BreweryParameters.getCustomersTable().should('be.visible');
    BreweryParameters.getCustomersTableGrid().should('exist');
    BreweryParameters.getCustomersTableCell('name', 0).should('have.text', firstCustomerName);
  });
});
