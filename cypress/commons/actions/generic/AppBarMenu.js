// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { FILE_NAME, SUPPORT_URL } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// Get elements bar menus
// Get elements in use info menu
function getUserInfoMenu() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.menu).click();
}
function getLanguageChangeSelector() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.language.change).click();
}

// In user info menu, select language item
function selectLanguage(language) {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.language[language]).click();
}

// Get elements in help menu
const docLink = `a[href="${FILE_NAME.DOC}"]`;
const supportPageLink = `a[href="${SUPPORT_URL}"]`;

function getHelpMenu() {
  return cy.get(GENERIC_SELECTORS.helpMenu.menu).click();
}
function getDocFileLinkSelector() {
  return cy.get(docLink);
}
function getSupportPageLink() {
  return cy.get(supportPageLink);
}

export const AppBarMenu = {
  getUserInfoMenu,
  getLanguageChangeSelector,
  selectLanguage,
  getHelpMenu,
  getDocFileLinkSelector,
  getSupportPageLink,
};
