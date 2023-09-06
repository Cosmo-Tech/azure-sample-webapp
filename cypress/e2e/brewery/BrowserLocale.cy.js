// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { stub } from '../../commons/services/stubbing';
import { Login, ScenarioParameters } from '../../commons/actions';
import { BreweryParameters } from '../../commons/actions/brewery';
import utils from '../../commons/TestUtils';

describe('specific behaviors depending on the locale set in browser settings', () => {
  before(() => {
    stub.start();
  });

  beforeEach(() => {
    const options = {
      visitOptions: {
        onBeforeLoad(win) {
          console.log('in onBeforeLoad');
          Object.defineProperty(win.navigator, 'language', { value: 'fr-FR' });
          Object.defineProperty(win.navigator, 'languages', { value: ['fr'] });
          Object.defineProperty(win.navigator, 'accept_languages', { value: ['fr'] });
        },
        headers: {
          'Accept-Language': 'fr',
        },
      },
    };
    Login.login(options);
  });

  it('can enter a float value in a number parameter when using French locale', () => {
    // This test used to fail when using Firefox with French locale (PROD-12227)
    ScenarioParameters.expandParametersAccordion();
    BreweryParameters.getCurrencyValueInput().clear().type('10.5');
    BreweryParameters.getCurrencyValueInput().blur();
    BreweryParameters.getCurrencyValueInput().should('value', '10.5');
  });
});
