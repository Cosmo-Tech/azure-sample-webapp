// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getInstanceVisualizationViewTab() {
  return cy.get(GENERIC_SELECTORS.instance.tabName);
}

function switchToInstanceVisualization() {
  cy.get(GENERIC_SELECTORS.instance.tabName).click();
}

function getCytoVizContainer() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizContainer);
}

function getLoadingSpinnerContainer(timeout = 4) {
  return cy.get(GENERIC_SELECTORS.instance.cytovizLoading, { timeout: timeout * 1000 });
}

function getPlaceholder() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizPlaceholder);
}

function getCytoscapeScene() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizCytoscapeScene);
}

function getOpenDrawerButton() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizOpenDrawerButton);
}
function getCloseDrawerButton() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizCloseDrawerButton);
}

function getDrawer() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizDrawer);
}

function getDrawerDetailsTabButton() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizDrawerDetailsTabButton);
}

function getDrawerSettingsTabButton() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizDrawerSettingsTabButton);
}

function getDrawerDetailsTabContent() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizDrawerDetailsTabContent);
}

function getDrawerSettingsTabContent() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizDrawerSettingsTabContent);
}

function getLayoutSelector() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizLayoutSelector);
}

function getLayoutSelectOption(layoutName) {
  return cy.get(GENERIC_SELECTORS.instance.cytovizLayoutSelectOption.replace('$LAYOUTNAME', layoutName));
}

function getCompactModeCheckbox() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizCompactModeCheckbox);
}

function getSpacingFactorSlider() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizSpacingFactorSlider);
}

function getZoomLimitsSlider() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizZoomLimitsSlider);
}

function getElementAttributeByName(attributeName) {
  return cy.get(GENERIC_SELECTORS.instance.cytovizElementAttributeByName.replace('$ATTRIBUTENAME', attributeName));
}

function getElementAttributeName() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizElementAttributeName);
}

function getElementAttributeValue() {
  return cy.get(GENERIC_SELECTORS.instance.cytovizElementAttributeValue);
}

function openDrawer() {
  return getOpenDrawerButton().click();
}
function closeDrawer() {
  return getCloseDrawerButton().click();
}
function switchToDrawerDetailsTab() {
  return getDrawerDetailsTabButton().click();
}
function switchToDrawerSettingsTab() {
  return getDrawerSettingsTabButton().click();
}

export const InstanceVisualization = {
  getInstanceVisualizationViewTab,
  switchToInstanceVisualization,
  getCytoVizContainer,
  getLoadingSpinnerContainer,
  getPlaceholder,
  getCytoscapeScene,
  getOpenDrawerButton,
  getCloseDrawerButton,
  getDrawer,
  getDrawerDetailsTabButton,
  getDrawerSettingsTabButton,
  getDrawerDetailsTabContent,
  getDrawerSettingsTabContent,
  getLayoutSelector,
  getLayoutSelectOption,
  getCompactModeCheckbox,
  getSpacingFactorSlider,
  getZoomLimitsSlider,
  getElementAttributeByName,
  getElementAttributeName,
  getElementAttributeValue,
  openDrawer,
  closeDrawer,
  switchToDrawerDetailsTab,
  switchToDrawerSettingsTab,
};
