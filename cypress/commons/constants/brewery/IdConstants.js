// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const BREWERY_SELECTORS = {
  scenario: {
    parameters: {
      bar: {
        stockInput: '[data-cy=stock-input]',
        restockInput: '[data-cy=restock-input]',
        waitersInput: '[data-cy=waiters-input]',
      },
      basicTypes: {
        tabName: '[data-cy=basic_types_tab]',
        currency: '[data-cy=currency]',
        currencyName: '[data-cy=currency_name]',
        currencyValue: '[data-cy=currency_value]',
        currencyUsed: '[data-cy=currency_used]',
        startDate: '[data-cy=start_date]',
      },
      datasetParts: {
        tabName: '[data-cy=dataset_parts_tab]',
        exampleDatasetPart1: '[data-cy=example_dataset_part_1]',
        exampleDatasetPart2: '[data-cy=example_dataset_part_2]',
      },
      extraDatasetPart: {
        tabName: '[data-cy=extra_dataset_part_tab]',
        exampleDatasetPart3: '[data-cy=example_dataset_part_3]',
      },
      customers: {
        tabName: '[data-cy=customers_tab]',
        table: '[data-cy=customers_table]',
      },
    },
  },
};
