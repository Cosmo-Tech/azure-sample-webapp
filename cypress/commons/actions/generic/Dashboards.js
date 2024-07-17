// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

export const getDashboardsTab = (timeout = 5) => {
  return cy.get(GENERIC_SELECTORS.dashboards.tabName, { timeout: timeout * 1000 });
};
