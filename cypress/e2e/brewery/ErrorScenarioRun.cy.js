// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Scenarios, ScenarioParameters, ErrorBanner, Login } from '../../commons/actions';
import { API_REGEX } from '../../commons/constants/generic/TestConstants';
import { stub } from '../../commons/services/stubbing';
import { apiUtils as api } from '../../commons/utils';

describe('Displaying error banner on run scenario fail', () => {
  before(() => stub.start());
  beforeEach(() => Login.login());
  after(() => stub.stop());

  it('can display error banner and dismiss it', () => {
    const updateRunAlias = api.interceptUpdateSimulationRunner();
    const startRunAlias = 'startRunAlias';
    cy.intercept('POST', API_REGEX.START_RUNNER, {
      statusCode: 400,
      body: {
        title: 'Bad Request',
        status: 400,
        detail: `<error placeholder>`,
      },
    }).as(startRunAlias);

    // Do not use ScenarioParameters.launch() action to be able to return an error immediately
    ScenarioParameters.getLaunchButton(180).should('not.be.disabled').click();
    api.waitAliases([updateRunAlias, startRunAlias]);

    ErrorBanner.checkAnDismissErrorBanner();
    Scenarios.getDashboardAccordionLogsDownloadButton().should('not.exist');
  });
});
