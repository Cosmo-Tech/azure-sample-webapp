// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { _getColumnWithoutDepth } from '../GenericTable';

describe('Test if column parsing to error handling works', () => {
  const COLUMN_DEFINITION_WITH_NO_DEPTH = [
    { field: 'athlete', params: ['params1', 'params2', 'params3'] },
    { field: 'age' },
    { field: 'country' },
    { field: 'sport' },
    { field: 'total', columnGroupShow: 'closed' },
    { field: 'gold', columnGroupShow: 'open' },
    { field: 'silver', columnGroupShow: 'open' },
    { field: 'bronze', columnGroupShow: 'open' },
  ];

  const COLUMN_WITH_ONE_DEPTH = [
    {
      headerName: 'Athlete Details',
      children: [
        { field: 'athlete', params: ['params1', 'params2', 'params3'] },
        { field: 'age' },
        { field: 'country' },
      ],
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

  const COLUMN_WITH_LOT_OF_DEPTHS_AND_ERROR_VALUES = [
    {
      headerName: 'Athlete Details',
      children: [
        { field: 'athlete', params: ['params1', 'params2', 'params3'] },
        { field: 'age' },
        { field: 'country' },
      ],
    },
    {
      headerName: 'Sports Results',
      children: [
        {
          headerName: 'Result',
          children: [
            {
              headerName: 'Sport',
              children: [{ field: 'sport' }, undefined],
            },
          ],
        },
        {
          headerName: 'Void Group',
          children: [],
        },
        { field: 'total', columnGroupShow: 'closed' },
        { field: 'gold', columnGroupShow: 'open' },
        { field: 'silver', columnGroupShow: 'open' },
        { field: 'bronze', columnGroupShow: 'open' },
        null,
      ],
    },
  ];

  test.each`
    columns                                       | expected                           | warningCount
    ${COLUMN_DEFINITION_WITH_NO_DEPTH}            | ${COLUMN_DEFINITION_WITH_NO_DEPTH} | ${0}
    ${COLUMN_WITH_ONE_DEPTH}                      | ${COLUMN_DEFINITION_WITH_NO_DEPTH} | ${0}
    ${COLUMN_WITH_LOT_OF_DEPTHS_AND_ERROR_VALUES} | ${COLUMN_DEFINITION_WITH_NO_DEPTH} | ${2}
  `(
    '$columns are parsed to no depth and the returned result equals $expected',
    ({ columns, expected, warningCount }) => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(_getColumnWithoutDepth(columns)).toStrictEqual(expected);
      expect(warn).toHaveBeenCalledTimes(warningCount);
      warn.mockReset();
    }
  );
});
