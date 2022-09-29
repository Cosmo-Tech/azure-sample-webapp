import { Login /*, Scenarios */ } from '../../commons/actions';
// import { DATASET, RUN_TEMPLATE } from '../../commons/constants/brewery/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { setup } from '../../commons/utils/setup';

// const SCENARIO_DATASET = DATASET.BREWERY_ADT;
// const SCENARIO_RUN_TEMPLATE = RUN_TEMPLATE.BASIC_TYPES;

describe('Check workspace permissions for admin', () => {
  before(() => {
    setup.initCypressAndStubbing();
    stub.start();
    Login.login();
  });

  beforeEach(() => {
    Login.relogin();
  });

  after(() => {
    stub.stop();
  });

  it('can create, edit, launch, validate, share, rename & delete a scenario', () => {
    // TODO: check buttons for actions described above are not disabled for an admin user
  });

  it('can add & remove people, and change roles in scenario sharing pop-up', () => {
    // TODO: open share pop-up, make some changes (add/remove/change role + workspace default role), confirm & refresh
    // page to check changes have been made
    // For local run with stubbing, page refresh could be replaced by switching to another scenario and then switching
    // back
  });

  it('is shown a message error when unauthorized changes are tried in scenario sharing pop-up', () => {
    // TODO: open share pop-up and check error messages are displayed when unauthorized changes are made:
    //  - remove the last admin of a scenario
    //  - ...
  });
});
