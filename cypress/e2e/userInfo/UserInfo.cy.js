// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AppBar, Login } from '../../commons/actions';
import { stub } from '../../commons/services/stubbing';

describe('UserInfo features', () => {
  beforeEach(() => {
    stub.start();
    Login.login();
  });

  after(() => {
    stub.stop();
  });

  it('can change the application language', () => {
    // Set lang to fr
    AppBar.getUserInfoMenu().should('not.be.visible');
    AppBar.openUserInfoMenu();
    AppBar.getUserInfoMenu().should('be.visible');
    AppBar.openLanguageSelectorInMenu();
    AppBar.getLanguageChangeButton('fr').should('be.visible');
    AppBar.getLanguageChangeButton('en').should('be.visible');
    AppBar.selectLanguageInMenu('fr').should(() => {
      expect(localStorage.getItem('locale')).to.eq('fr');
    });

    // Set lang to en
    AppBar.switchLanguageTo('en').should(() => {
      expect(localStorage.getItem('locale')).to.eq('en');
    });
  });
});
