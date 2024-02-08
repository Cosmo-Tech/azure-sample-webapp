// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
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
  return cy.get(GENERIC_SELECTORS.helpMenu.documentation).find('a');
}
function getSupportPageLink() {
  return cy.get(GENERIC_SELECTORS.helpMenu.support).find('a');
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
function getTechnicalInfoButton() {
  return cy.get(GENERIC_SELECTORS.helpMenu.technicalInfoButton);
}
function getTechnicalInfoDialog() {
  return cy.get(GENERIC_SELECTORS.helpMenu.technicalInfoDialog);
}
function getTechnicalInfoSolutionName() {
  return cy.get(GENERIC_SELECTORS.helpMenu.technicalInfoSolutionName);
}
function getTechnicalInfoSolutionDescription() {
  return cy.get(GENERIC_SELECTORS.helpMenu.technicalInfoSolutionDescription);
}
function getTechnicalInfoDialogCloseButton() {
  return cy.get(GENERIC_SELECTORS.helpMenu.technicalInfoDialogCloseButton);
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
function logout() {
  openUserInfoMenu();
  getLogoutButton().click();
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
function openTechnicalInfoDialog() {
  return getTechnicalInfoButton().click();
}
function closeTechnicalInfoDialog() {
  return getTechnicalInfoDialogCloseButton().click();
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
  logout,
  openHelpMenu,
  openAboutDialog,
  closeAboutDialog,
  getTechnicalInfoDialog,
  getTechnicalInfoButton,
  getTechnicalInfoSolutionName,
  getTechnicalInfoSolutionDescription,
  getTechnicalInfoDialogCloseButton,
  openTechnicalInfoDialog,
  closeTechnicalInfoDialog,
};
