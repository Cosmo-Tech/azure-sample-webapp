// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const TWINGRAPH_QUERIES_RESPONSES = [
  [
    {
      count: 1,
      keys: ['id', 'NbWaiters', 'RestockQty', 'Stock', 'Id'],
      label: 'Bar',
    },
    {
      count: 4,
      keys: ['id', 'SurroundingSatisfaction', 'Id', 'Satisfaction', 'Thirsty'],
      label: 'Customer',
    },
    {
      count: 1,
      keys: ['id'],
      label: 'Brewery',
    },
  ],
  [
    {
      NbWaiters: 10,
      id: 'MyBar',
      Id: 1,
      RestockQty: 30,
      Stock: 50,
    },
  ],
  [
    {
      id: 'Customer3',
      Id: 4,
      Thirsty: false,
      SurroundingSatisfaction: 0,
      Satisfaction: 0,
    },
    {
      id: 'Customer1',
      Id: 2,
      Thirsty: false,
      SurroundingSatisfaction: 0,
      Satisfaction: 0,
    },
    {
      id: 'Customer2',
      Id: 3,
      Thirsty: false,
      SurroundingSatisfaction: 0,
      Satisfaction: 0,
    },
    {
      id: 'Customer4',
      Id: 5,
      Thirsty: false,
      SurroundingSatisfaction: 0,
      Satisfaction: 0,
    },
  ],
  [
    {
      id: 'Model',
    },
  ],
  [
    {
      type: 'arc_Satisfaction',
      count: 8,
      keys: ['id'],
    },
    {
      type: 'Bar_vertex',
      count: 4,
      keys: ['owner', 'id'],
    },
    {
      type: 'contains',
      count: 1,
      keys: ['id'],
    },
  ],
  [
    {
      dst: 'Customer1',
      src: 'Customer3',
      properties: {
        id: '4_arc2_2',
      },
    },
    {
      dst: 'Customer2',
      src: 'Customer3',
      properties: {
        id: '4_arc7_3',
      },
    },
    {
      dst: 'Customer3',
      src: 'Customer1',
      properties: {
        id: '2_arc1_4',
      },
    },
    {
      dst: 'Customer2',
      src: 'Customer1',
      properties: {
        id: '2_arc3_3',
      },
    },
    {
      dst: 'Customer4',
      src: 'Customer1',
      properties: {
        id: '2_arc5_5',
      },
    },
    {
      dst: 'Customer3',
      src: 'Customer2',
      properties: {
        id: '3_arc8_4',
      },
    },
    {
      dst: 'Customer1',
      src: 'Customer2',
      properties: {
        id: '3_arc4_2',
      },
    },
    {
      dst: 'Customer1',
      src: 'Customer4',
      properties: {
        id: '5_arc6_2',
      },
    },
  ],
  [
    {
      dst: 'Customer3',
      src: 'MyBar',
      properties: {
        owner: true,
        id: '1_vertex_4',
      },
    },
    {
      dst: 'Customer1',
      src: 'MyBar',
      properties: {
        owner: true,
        id: '1_vertex_2',
      },
    },
    {
      dst: 'Customer2',
      src: 'MyBar',
      properties: {
        owner: true,
        id: '1_vertex_3',
      },
    },
    {
      dst: 'Customer4',
      src: 'MyBar',
      properties: {
        owner: true,
        id: '1_vertex_5',
      },
    },
  ],
  [
    {
      dst: 'MyBar',
      src: 'Model',
      properties: {
        id: 'Model_contains_1',
      },
    },
  ],
];
