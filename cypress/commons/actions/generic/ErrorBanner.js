// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getErrorBanner(timeout = 20000) {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.banner, { timeout });
}

function getDismissErrorButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.dismissErrorButton);
}

function getErrorDetailText() {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.errorDetail);
}

function getErrorCommentText() {
  return cy.get(GENERIC_SELECTORS.genericComponents.errorBanner.errorComment);
}

function dismissErrorIfVisible() {
  getDismissErrorButton().then(($btn) => {
    if ($btn.is(':visible')) {
      $btn.trigger('click');
      getErrorBanner().should('not.be.visible');
    }
  });
}

function checkAnDismissErrorBanner() {
  getErrorBanner().should('be.visible');
  getDismissErrorButton().click();
  getErrorBanner().should('not.be.visible');
}

export const ErrorBanner = {
  getErrorBanner,
  getDismissErrorButton,
  getErrorCommentText,
  getErrorDetailText,
  checkAnDismissErrorBanner,
  dismissErrorIfVisible,
};
