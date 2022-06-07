// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getErrorBanner() {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.banner);
}

function getDismissErrorButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.dismissErrorButton);
}

export const ErrorBanner = {
  getErrorBanner,
  getDismissErrorButton,
};
