// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { FILE_NAME } from '../../commons/TestConstants';
import { SELECTORS } from '../../commons/IdConstants';

describe('UserInfo features', () => {
  const docFileLink = `a[href="${FILE_NAME.DOC}"]`;

  it('can log in with Microsoft account account', () => {
    cy.visit('/');
    cy.login();
  });

  it('can download the documentation PDF', () => {
    cy.get(SELECTORS.userProfileMenu.menu).click();
    // Check that the link to the documentation PDF file exists
    cy.get(docFileLink).should('have.attr', 'target', '_blank');
  });

  it('can change the application language', () => {
    // Set lang to fr
    cy.get(SELECTORS.userProfileMenu.menu).click();
    cy.get(SELECTORS.userProfileMenu.language.change).click();
    cy.get(SELECTORS.userProfileMenu.language.fr).click().should(() => {
      expect(localStorage.getItem('locale')).to.eq('fr');
    });
    // Set lang to en
    cy.get(SELECTORS.userProfileMenu.menu).click();
    cy.get(SELECTORS.userProfileMenu.language.change).click();
    cy.get(SELECTORS.userProfileMenu.language.en).click().should(() => {
      expect(localStorage.getItem('locale')).to.eq('en');
    });
  });
});
