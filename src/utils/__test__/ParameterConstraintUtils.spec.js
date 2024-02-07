// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ParameterConstraintsUtils } from '../ParameterConstraintsUtils';
import { DEFAULT_PARAMETERS_LIST } from './fixtures/ParametersLists';

describe('varTypes comparison', () => {
  test.each`
    varType     | varTypeToCompare | result
    ${'string'} | ${'string'}      | ${true}
    ${'string'} | ${'date'}        | ${false}
    ${'number'} | ${'int'}         | ${true}
    ${'int'}    | ${'number'}      | ${true}
    ${'date'}   | ${'someVartype'} | ${false}
    ${null}     | ${'date'}        | ${false}
    ${'string'} | ${undefined}     | ${false}
  `('varType comparison returns expected result', ({ varType, varTypeToCompare, result }) => {
    const res = ParameterConstraintsUtils.getIsVarTypesComparisonValid(varType, varTypeToCompare);
    expect(result).toStrictEqual(res);
  });
});

describe('generating of validation constraint', () => {
  test.each`
    validationString   | varType      | parametersList             | expectedResult
    ${'> start_date'}  | ${'date'}    | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '>', id: 'start_date' }}
    ${'< stock'}       | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '<', id: 'stock' }}
    ${'!= tables'}     | ${'int'}     | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '!=', id: 'tables' }}
    ${'> activated'}   | ${'bool'}    | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'> evaluations'} | ${'string'}  | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'> restock'}     | ${'date'}    | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'* end_date'}    | ${'date'}    | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${null}            | ${'date'}    | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${undefined}       | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${''}              | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'<stock'}        | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'<  stock'}      | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '<', id: 'stock' }}
    ${' < stock '}     | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '<', id: 'stock' }}
    ${' <   stock'}    | ${'number'}  | ${DEFAULT_PARAMETERS_LIST} | ${{ operator: '<', id: 'stock' }}
    ${'> restock'}     | ${null}      | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'> restock'}     | ${undefined} | ${DEFAULT_PARAMETERS_LIST} | ${null}
    ${'> restock'}     | ${'date'}    | ${null}                    | ${null}
    ${'> restock'}     | ${'date'}    | ${undefined}               | ${null}
    ${'> restock'}     | ${'date'}    | ${[]}                      | ${null}
    ${'> restock'}     | ${'date'}    | ${{}}                      | ${null}
  `(
    'function that generates validation constraint returns expected result',
    ({ validationString, varType, parametersList, expectedResult }) => {
      const result = ParameterConstraintsUtils.getParameterValidationConstraint(
        validationString,
        varType,
        parametersList
      );
      expect(result).toStrictEqual(expectedResult);
    }
  );
});
