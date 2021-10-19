// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const BREWERY_SELECTORS = {
  scenario: {
    parameters: {
      brewery: {
        stockInput: '[data-cy=stock-input]',
        restockInput: '[data-cy=restock-input]',
        waitersInput: '[data-cy=waiters-input]',
      },
      basicTypes: {
        tabName: '[data-cy=basic_types_tab]',
        textInput: 'input[id=currency_name]',
        numberInput: 'input[id=currency_value]',
        enumInput: 'div[id=currency]',
        exampleDatasetPart1: '[data-cy=example_dataset_part_1]',
        exampleDatasetPart2: '[data-cy=example_dataset_part_2]',
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
    },
  },
};
