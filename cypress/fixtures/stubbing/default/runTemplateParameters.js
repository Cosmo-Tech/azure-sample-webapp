// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const STOCK = { id: 'stock', labels: { fr: 'Stock', en: 'Stock' }, varType: 'int' };
const RESTOCK_QTY = { id: 'restock_qty', labels: { fr: 'Restock', en: 'Restock' }, varType: 'int' };
const NB_WAITERS = { id: 'nb_waiters', labels: { fr: 'Serveurs', en: 'Waiters' }, varType: 'int' };

const CURRENCY = {
  id: 'currency',
  labels: { fr: 'Symbole de la monnaie', en: 'Currency symbol' },
  varType: 'enum',
  additionalData: {
    enumValues: [
      {
        key: 'USD',
        value: {
          en: 'United States dollar ($)',
          fr: 'Dollar américain ($)',
        },
        tooltipText: {
          fr: 'Le dollar américain est la monnaie nationale des États-Unis et de plusieurs autres pays',
          en: 'The United States dollar is the official currency of the United States and several other countries',
        },
      },
      {
        key: 'EUR',
        value: 'Euro (€)',
        tooltipText: {
          fr: "L'euro est la monnaie unique de 20 des 27 États membres de l'Union européenne",
          en: 'Euro is the official currency of 20 of the 27 member states of the European Union',
        },
      },
      {
        key: 'BTC',
        value: 'Bitcoin (฿)',
        tooltipText: {
          fr: "Le Bitcoin est une cryptomonnaie dont l'objectif est de créer un système financier décentralisé",
          en: 'Bitcoin is a protocol which implements a public, permanent, and decentralized ledger',
        },
      },
      {
        key: 'JPY',
        value: {
          en: 'Japanese yen (¥)',
          fr: 'Yen (¥)',
        },
      },
    ],
  },
};

const CURRENCY_NAME = {
  id: 'currency_name',
  labels: { fr: 'Nom de la monnaie', en: 'Currency name' },
  varType: 'string',
};

const CURRENCY_VALUE = {
  id: 'currency_value',
  defaultValue: '1000',
  labels: { fr: 'Valeur', en: 'Value' },
  varType: 'number',
};

const CURRENCY_USED = {
  id: 'currency_used',
  labels: { fr: 'Activer la monnaie', en: 'Enable currency' },
  varType: 'bool',
};

const START_DATE = {
  id: 'start_date',
  labels: { fr: 'Date de départ', en: 'Start date' },
  varType: 'date',
};

const AVERAGE_CONSUMPTION = {
  id: 'average_consumption',
  labels: {
    fr: 'Consommation moyenne',
    en: 'Average consumption',
  },
  varType: 'number',
  defaultValue: '3',
  minValue: '0',
  maxValue: '10',
  regexValidation: null,
  additionalData: {
    subType: 'SLIDER',
    tooltipText: {
      fr: 'En pintes',
      en: 'In pints',
    },
  },
};

const ADDITIONAL_SEATS = {
  id: 'additional_seats',
  labels: {
    fr: 'Sièges additionnels',
    en: 'Additional seats',
  },
  varType: 'number',
  defaultValue: '-4',
  minValue: '-600',
  maxValue: '2500',
  additionalData: {
    tooltipText: {
      fr: 'La valeur peut être comprise entre -600 et 2500',
      en: 'Value can be between -600 and 2500',
    },
  },
};

const ADDITIONAL_TABLES = {
  id: 'additional_tables',
  labels: {
    fr: 'Tables additionnelles',
    en: 'Additional tables',
  },
  varType: 'number',
  defaultValue: '3',
  minValue: '-150',
  maxValue: '12000',
  additionalData: {
    tooltipText: {
      fr: 'La valeur peut être comprise entre -150 et 12000',
      en: 'Value can be between -150 and 12000',
    },
  },
};

const ACTIVATED = {
  id: 'activated',
  labels: {
    en: 'Activated',
    fr: 'Activé',
  },
  varType: 'bool',
  defaultValue: 'false',
};

const EVALUATION = {
  id: 'evaluation',
  labels: {
    fr: 'Evaluation',
    en: 'Evaluation',
  },
  varType: 'string',
  defaultValue: 'Good',
  additionalData: {
    minLength: 2,
  },
};

const VOLUME_UNIT = {
  id: 'volume_unit',
  labels: {
    en: 'Volume unit',
    fr: 'Unité de volume',
  },
  varType: 'enum',
  defaultValue: 'LITRE',
  additionalData: {
    enumValues: [
      {
        key: 'LITRE',
        value: 'L',
      },
      {
        key: 'BARREL',
        value: 'bl',
      },
      {
        key: 'CUBIC_METRE',
        value: 'm³',
      },
    ],
    subType: 'RADIO',
  },
};

const COMMENT = {
  id: 'comment',
  labels: {
    en: 'Comment',
    fr: 'Commentaire',
  },
  varType: 'string',
  defaultValue: 'None',
  additionalData: {
    maxLength: 30,
  },
};

const ADDITIONAL_DATE = {
  id: 'additional_date',
  labels: {
    en: 'Additional date',
    fr: 'Date additionnelle',
  },
  varType: 'date',
  defaultValue: '2022-06-22T00:00:00.000Z',
  minValue: '2021-01-01T00:00:00.000Z',
  maxValue: '2022-12-31T00:00:00.000Z',
};

const INITIAL_STOCK_DATASET = {
  id: 'initial_stock_dataset',
  labels: { fr: 'Stock de départ', en: 'Initial stock' },
  varType: '%DATASET_PART_ID_FILE%',
};

const EXAMPLE_DATASET_PART_1 = {
  id: 'example_dataset_part_1',
  labels: { fr: 'Exemple de sous-partie de dataset 1', en: 'Example dataset part 1' },
  varType: '%DATASET_PART_ID_FILE%',
};

const EXAMPLE_DATASET_PART_2 = {
  id: 'example_dataset_part_2',
  labels: { fr: 'Exemple de sous-partie de dataset 2', en: 'Example dataset part 2' },
  varType: '%DATASET_PART_ID_FILE%',
};

const EXAMPLE_DATASET_PART_3 = {
  id: 'example_dataset_part_3',
  labels: { fr: 'Exemple de sous-partie de dataset 3', en: 'Example dataset part 3' },
  varType: '%DATASET_PART_ID_FILE%',
};

const CUSTOMERS = { id: 'customers', labels: { fr: 'Clients', en: 'Customers' }, varType: '%DATASET_PART_ID_FILE%' };
const EVENTS = {
  id: 'events',
  labels: {
    fr: 'Evénements',
    en: 'Events',
  },
  varType: '%DATASET_PART_ID_FILE%',
  // "defaultValue": "d-kovkq76eo1qj9", // Dataset default value not usable yet with stubbing
  additionalData: {
    tooltipText: {
      fr: "Importez ou exportez un fichier d'événements",
      en: 'Import or export an events file',
    },
    description: 'events data',
    subType: 'TABLE',
    columns: [
      {
        field: 'theme',
        type: ['string'],
      },
      {
        field: 'date',
        type: ['date'],
        minValue: '01/01/1900',
        maxValue: '31/12/2999',
      },
      {
        field: 'timeOfDay',
        type: ['enum'],
        enumValues: ['morning', 'midday', 'afternoon', 'evening'],
      },
      {
        field: 'eventType',
        type: ['string', 'nonResizable', 'nonEditable'],
      },
      {
        field: 'reservationsNumber',
        type: ['int'],
        minValue: '0',
        maxValue: '300',
        acceptsEmptyFields: true,
      },
      {
        field: 'online',
        type: ['bool', 'nonSortable'],
      },
    ],
    dateFormat: 'dd/MM/yyyy',
  },
};

const TRAINING_START_DATE = {
  id: 'training_start_date',
  labels: { fr: 'Date de départ', en: 'Start date' },
  varType: 'date',
};

const TRAINING_END_DATE = { id: 'training_end_date', labels: { fr: 'Date de Fin', en: 'End date' }, varType: 'date' };

// ETL and dynamic values parameters from DatasetManager
const ETL_ENUM = {
  id: 'etl_enum_parameter',
  varType: 'enum',
  additionalData: {
    enumValues: [
      { key: 'option1', value: 'Option 1' },
      { key: 'option2', value: 'Option 2' },
    ],
  },
};

const ETL_LIST = {
  id: 'etl_list_parameter',
  varType: 'list',
  additionalData: {
    enumValues: [
      { key: 'option1', value: 'Option 1' },
      { key: 'option2', value: 'Option 2' },
    ],
  },
};

const ETL_STRING = { id: 'etl_string_parameter', varType: 'string' };
const ETL_STRING_WITH_DEFAULT = {
  id: 'etl_string_parameter_with_default_value',
  varType: 'string',
  defaultValue: 'is prefilled',
};

const ETL_DATE = { id: 'etl_date_parameter', varType: 'date' };

const DYNAMIC_VALUES_CUSTOMERS_ENUM = {
  id: 'dynamic_values_customers_enum',
  labels: {
    fr: 'Client (enum)',
    en: 'Customer (enum)',
  },
  varType: 'enum',
  additionalData: {
    tooltipText: {
      fr: 'Sélectionnez un client parmi la liste',
      en: 'Pick a customer from the list',
    },
    dynamicEnumValues: {
      type: 'dbDatasetPart',
      datasetPartName: 'customers',
      resultKey: 'id',
      options: {
        selects: 'id',
      },
    },
  },
};

const SCENARIO_TO_COMPARE = {
  id: 'scenario_to_compare',
  labels: {
    fr: 'Scénario à comparer',
    en: 'Scenario to compare',
  },
  varType: 'enum',
  additionalData: {
    subType: 'SCENARIOS',
    runTemplateFilter: ['sim_brewery_parameters', 'sim_mock_parameters'],
    tooltipText: {
      fr: 'Scénario auquel on va comparer les données',
      en: 'Scenario against which to compare data',
    },
  },
};

export const PARAMETERS = {
  STOCK,
  RESTOCK_QTY,
  NB_WAITERS,
  CURRENCY,
  CURRENCY_NAME,
  CURRENCY_VALUE,
  CURRENCY_USED,
  START_DATE,
  AVERAGE_CONSUMPTION,
  ADDITIONAL_SEATS,
  ADDITIONAL_TABLES,
  ACTIVATED,
  EVALUATION,
  VOLUME_UNIT,
  COMMENT,
  ADDITIONAL_DATE,
  INITIAL_STOCK_DATASET,
  EXAMPLE_DATASET_PART_1,
  EXAMPLE_DATASET_PART_2,
  EXAMPLE_DATASET_PART_3,
  CUSTOMERS,
  EVENTS,
  TRAINING_START_DATE,
  TRAINING_END_DATE,
  ETL_ENUM,
  ETL_LIST,
  ETL_STRING,
  ETL_STRING_WITH_DEFAULT,
  ETL_DATE,
  DYNAMIC_VALUES_CUSTOMERS_ENUM,
  SCENARIO_TO_COMPARE,
};
