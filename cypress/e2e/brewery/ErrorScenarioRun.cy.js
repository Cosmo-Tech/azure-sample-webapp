// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Scenarios, ScenarioParameters, ErrorBanner, Login } from '../../commons/actions';
import { URL_REGEX } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';

describe('Displaying error banner on run scenario fail', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can display error banner and dismiss it', () => {
    cy.intercept('POST', URL_REGEX.SCENARIO_PAGE_RUN_WITH_ID, {
      statusCode: 400,
      body: {
        title: 'Bad Request',
        status: 400,
        detail: `<error placeholder>`,
      },
    });

    // Do not use "launch" action to be able to use our custom 'intercept'
    ScenarioParameters.getLaunchButton(180).should('not.be.disabled').click();
    ErrorBanner.checkAnDismissErrorBanner();
    Scenarios.getDashboardAccordionLogsDownloadButton().should('not.exist');
  });
});
