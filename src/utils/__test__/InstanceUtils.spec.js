// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { InstanceUtils } from '../InstanceUtils';

const VALID_VIEW_CONFIG = {
  dataContent: {
    compounds: { Bar_vertex: {} }, // Field 'compounds' is not relevant for the function and will be ignored
    edges: {
      arc_Satisfaction: {
        foo: 'bar', // Field 'foo' is not relevant for the function and will be ignored
        attributesOrder: ['id', 'unknown_attribute'], // Extra attribute that won't be in twingraph keys
      },
    },
    nodes: { Customer: { attributesOrder: ['A1', 'B1', 'C1', 'A2'] } },
  },
};
const VALID_TWINGRAPH_KEYS = {
  nodes: {
    Bar: ['id', 'NbWaiters', 'RestockQty', 'Stock'], // Entity type not present in view config
    Customer: ['id', 'Thirsty', 'B1', 'A2', 'C1', 'A1'], // Unordered, with some keys not defined in view config
  },
  edges: { arc_Satisfaction: ['id'] },
};

const EXPECTED_RESULT_FROM_TWINGRAPH_KEYS_ONLY = VALID_TWINGRAPH_KEYS;
const EXPECTED_RESULT_FROM_CONFIG_ONLY = {
  nodes: { Customer: ['A1', 'B1', 'C1', 'A2'] },
  edges: { arc_Satisfaction: ['id', 'unknown_attribute'] },
};

const EXPECTED_RESULT_AFTER_MERGE = {
  nodes: { Bar: ['id', 'NbWaiters', 'RestockQty', 'Stock'], Customer: ['A1', 'B1', 'C1', 'A2', 'id', 'Thirsty'] },
  edges: { arc_Satisfaction: ['id', 'unknown_attribute'] }, // Extra attribute that won't be in twingraph keys
};

describe('mergeGraphItemAttributesConfiguration', () => {
  test('returns default data with invalid instance view config', () => {
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(null, VALID_TWINGRAPH_KEYS);
    expect(result).toEqual(EXPECTED_RESULT_FROM_TWINGRAPH_KEYS_ONLY);
  });

  test('returns default data with invalid twingraph items keys', () => {
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(VALID_VIEW_CONFIG, null);
    expect(result).toEqual(EXPECTED_RESULT_FROM_CONFIG_ONLY);
  });

  test('merges node and edge configurations correctly', () => {
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(VALID_VIEW_CONFIG, VALID_TWINGRAPH_KEYS);
    expect(result).toEqual(EXPECTED_RESULT_AFTER_MERGE);
  });

  test('handles empty attributesOrder arrays', () => {
    const config = {
      dataContent: {
        nodes: { Customer: { attributesOrder: [] } },
        edges: { arc_Satisfaction: { attributesOrder: [] } },
      },
    };
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(config, VALID_TWINGRAPH_KEYS);
    expect(result).toEqual(EXPECTED_RESULT_FROM_TWINGRAPH_KEYS_ONLY);
  });

  test('ignores configurations without attributesOrder', () => {
    const config = {
      dataContent: {
        nodes: { Customer: { foo: 'bar' } },
        edges: { arc_Satisfaction: { baz: 'qux' } },
      },
    };
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(config, VALID_TWINGRAPH_KEYS);
    expect(result).toEqual(EXPECTED_RESULT_FROM_TWINGRAPH_KEYS_ONLY);
  });

  test('handles non-array attributesOrder values', () => {
    const config = {
      dataContent: {
        nodes: { Customer: { attributesOrder: 'invalid' } },
        edges: { arc_Satisfaction: { attributesOrder: 123 } },
      },
    };
    const result = InstanceUtils.mergeGraphItemAttributesConfiguration(config, VALID_TWINGRAPH_KEYS);
    expect(result).toEqual(EXPECTED_RESULT_FROM_TWINGRAPH_KEYS_ONLY);
  });
});
