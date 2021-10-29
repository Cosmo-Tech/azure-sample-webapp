// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { AppBarMenu } from '../../commons/actions/generic/AppBarMenu';
import { PAGE_NAME } from '../../commons/constants/generic/TestConstants';

describe('UserInfo features', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.relogin();
  });

  it('can change the application language', () => {
    // Set lang to fr
    AppBarMenu.getUserInfoMenu();
    AppBarMenu.getLanguageChangeSelector();
    AppBarMenu.selectLanguage('fr').should(() => {
      expect(localStorage.getItem('locale')).to.eq('fr');
    });

    // Set lang to en
    AppBarMenu.getUserInfoMenu();
    AppBarMenu.getLanguageChangeSelector();
    AppBarMenu.selectLanguage('en').should(() => {
      expect(localStorage.getItem('locale')).to.eq('en');
    });
  });
});
