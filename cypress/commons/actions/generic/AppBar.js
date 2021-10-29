// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { FILE_NAME, SUPPORT_URL } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// User profile menu elements
function getUserInfoMenuButton() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.button);
}
function getUserInfoMenu() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.popover);
}
function getLanguageSelectorButton() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.language.change);
}
function getLanguageChangeButton(lang) {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.language[lang]);
}
function getLogoutButton() {
  return cy.get(GENERIC_SELECTORS.userProfileMenu.logout);
}

// Help menu elements
function getHelpMenu() {
  return cy.get(GENERIC_SELECTORS.helpMenu.menu);
}
function getDocumentationLink() {
  const docLink = `a[href="${FILE_NAME.DOC}"]`;
  return cy.get(docLink);
}
function getSupportPageLink() {
  const supportPageLink = `a[href="${SUPPORT_URL}"]`;
  return cy.get(supportPageLink);
}

// User profile actions
function openUserInfoMenu() {
  getUserInfoMenuButton().click();
}
function openLanguageSelectorInMenu() {
  return getLanguageSelectorButton().click();
}
function selectLanguageInMenu(lang) {
  return getLanguageChangeButton(lang).click();
}

function switchLanguageTo(lang) {
  openUserInfoMenu();
  openLanguageSelectorInMenu();
  return selectLanguageInMenu(lang);
}

// Help menu actions
function openHelpMenu() {
  return getHelpMenu().click();
}

export const AppBar = {
  getUserInfoMenuButton,
  getUserInfoMenu,
  getLanguageSelectorButton,
  getLanguageChangeButton,
  getLogoutButton,
  getHelpMenu,
  getDocumentationLink,
  getSupportPageLink,
  openUserInfoMenu,
  openLanguageSelectorInMenu,
  selectLanguageInMenu,
  switchLanguageTo,
  openHelpMenu,
};
