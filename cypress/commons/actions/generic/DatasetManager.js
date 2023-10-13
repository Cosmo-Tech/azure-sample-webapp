// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getDatasetManagerTab(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.datasetmanager.tabName, { timeout: timeout * 1000 });
}

function getDatasetManagerView(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.datasetmanager.view, { timeout: timeout * 1000 });
}

function switchToDatasetManagerView() {
  return getDatasetManagerTab().click();
}

export const DatasetManager = {
  getDatasetManagerTab,
  switchToDatasetManagerView,
  getDatasetManagerView,
};
