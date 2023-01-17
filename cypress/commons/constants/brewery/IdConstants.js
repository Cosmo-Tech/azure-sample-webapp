// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const BREWERY_SELECTORS = {
  scenario: {
    parameters: {
      bar: {
        stockInput: '[data-cy=number-input-stock]',
        restockInput: '[data-cy=number-input-restock_qty]',
        waitersInput: '[data-cy=number-input-nb_waiters]',
      },
      basicTypes: {
        tabName: '[data-cy=basic_types_tab]',
        currency: '[data-cy=enum-input-currency]',
        currencyName: '[data-cy=text-input-currency_name]',
        currencyValue: '[data-cy=number-input-currency_value]',
        currencyUsed: '[data-cy=toggle-input-currency_used]',
        startDate: '[data-cy=date-input-start_date]',
        averageConsumption: '[data-cy=slider-input-average_consumption]',
      },
      datasetParts: {
        tabName: '[data-cy=dataset_parts_tab]',
        exampleDatasetPart1: '[data-cy=file-upload-example_dataset_part_1]',
        exampleDatasetPart2: '[data-cy=file-upload-example_dataset_part_2]',
      },
      extraDatasetPart: {
        tabName: '[data-cy=extra_dataset_part_tab]',
        exampleDatasetPart3: '[data-cy=file-upload-example_dataset_part_3]',
      },
      customers: {
        tabName: '[data-cy=customers_tab]',
        table: '[data-cy=table-customers]',
      },
      events: {
        tabName: '[data-cy=events_tab]',
        table: '[data-cy=table-events]',
        additionalSeats: '[data-cy=number-input-additional_seats]',
        activated: '[data-cy=toggle-input-activated]',
        evaluation: '[data-cy=text-input-evaluation]',
      },
      additionalParameters: {
        tabName: '[data-cy=additional_parameters_tab]',
        volumeUnit: '[data-cy=enum-input-volume_unit]',
        additionalTables: '[data-cy=number-input-additional_tables]',
        comment: '[data-cy=text-input-comment]',
        additionalDate: '[data-cy=date-input-additional_date]',
      },
    },
  },
};
