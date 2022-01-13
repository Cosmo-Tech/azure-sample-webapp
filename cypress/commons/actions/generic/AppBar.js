// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { FILE_NAME, SUPPORT_URL } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// User profile menu elements
function getUserInfoMenuButton() {
  return cy.get(GENERIC_SELECTORS.userInfoMenu.button);
}
function getUserInfoMenu() {
  return cy.get(GENERIC_SELECTORS.userInfoMenu.popover);
}
function getLanguageSelectorButton() {
  return cy.get(GENERIC_SELECTORS.userInfoMenu.language.change);
}
function getLanguageChangeButton(lang) {
  return cy.get(GENERIC_SELECTORS.userInfoMenu.language[lang]);
}
function getLogoutButton() {
  return cy.get(GENERIC_SELECTORS.userInfoMenu.logout);
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
function getAboutButton() {
  return cy.get(GENERIC_SELECTORS.helpMenu.aboutButton);
}
function getAboutDialogCloseButton() {
  return cy.get(GENERIC_SELECTORS.helpMenu.aboutDialogCloseButton);
}
function getAboutDialog() {
  return cy.get(GENERIC_SELECTORS.helpMenu.aboutDialog);
}

// User profile actions
function openUserInfoMenu() {
  return getUserInfoMenuButton().click();
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
function openAboutDialog() {
  return getAboutButton().click();
}
function closeAboutDialog() {
  return getAboutDialogCloseButton().click();
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
  getAboutButton,
  getAboutDialog,
  openUserInfoMenu,
  openLanguageSelectorInMenu,
  selectLanguageInMenu,
  switchLanguageTo,
  openHelpMenu,
  openAboutDialog,
  closeAboutDialog,
};
