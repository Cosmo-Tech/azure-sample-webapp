// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { _getColumnWithoutDepths } from './GenericTable';

describe('Test if column parsing before send it to core works', () => {
  const COLOMN_DEFINITION_WITH_NO_DEPTH = [
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country' },
    { field: 'sport' },
    { field: 'total', columnGroupShow: 'closed' },
    { field: 'gold', columnGroupShow: 'open' },
    { field: 'silver', columnGroupShow: 'open' },
    { field: 'bronze', columnGroupShow: 'open' },
  ];

  const COLOMN_WITH_ONE_DEPTH = [
    {
      headerName: 'Athlete Details',
      children: [{ field: 'athlete' }, { field: 'age' }, { field: 'country' }],
    },
    {
      headerName: 'Sports Results',
      children: [
        { field: 'sport' },
        { field: 'total', columnGroupShow: 'closed' },
        { field: 'gold', columnGroupShow: 'open' },
        { field: 'silver', columnGroupShow: 'open' },
        { field: 'bronze', columnGroupShow: 'open' },
      ],
    },
  ];

  const COLOMN_WITH_LOT_OF_DEPTHS = [
    {
      headerName: 'Athlete Details',
      children: [{ field: 'athlete' }, { field: 'age' }, { field: 'country' }],
    },
    {
      headerName: 'Sports Results',
      children: [
        {
          headerName: 'BOOM',
          children: [
            {
              headerName: 'BAM',
              children: [{ field: 'sport' }],
            },
          ],
        },
        {
          headerName: 'Troll',
          children: [],
        },
        { field: 'total', columnGroupShow: 'closed' },
        { field: 'gold', columnGroupShow: 'open' },
        { field: 'silver', columnGroupShow: 'open' },
        { field: 'bronze', columnGroupShow: 'open' },
      ],
    },
  ];

  test.each`
    columns                            | expected
    ${COLOMN_DEFINITION_WITH_NO_DEPTH} | ${COLOMN_DEFINITION_WITH_NO_DEPTH}
    ${COLOMN_WITH_ONE_DEPTH}           | ${COLOMN_DEFINITION_WITH_NO_DEPTH}
    ${COLOMN_WITH_LOT_OF_DEPTHS}       | ${COLOMN_DEFINITION_WITH_NO_DEPTH}
  `('$columns is parsed to no depths and be return as $expected', ({ columns, expected }) => {
    expect(_getColumnWithoutDepths(columns)).toStrictEqual(expected);
  });
});
