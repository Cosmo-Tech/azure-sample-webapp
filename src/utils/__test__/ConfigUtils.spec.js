// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ConfigUtils } from '../ConfigUtils';

describe('buildExtendedVarType with possible values', () => {
  test.each`
    varType      | extension      | expectedRes
    ${null}      | ${null}        | ${undefined}
    ${null}      | ${undefined}   | ${undefined}
    ${null}      | ${''}          | ${undefined}
    ${null}      | ${'extension'} | ${undefined}
    ${''}        | ${null}        | ${undefined}
    ${''}        | ${undefined}   | ${undefined}
    ${''}        | ${''}          | ${undefined}
    ${''}        | ${'extension'} | ${undefined}
    ${'varType'} | ${null}        | ${'varType'}
    ${'varType'} | ${undefined}   | ${'varType'}
    ${'varType'} | ${''}          | ${'varType'}
    ${'varType'} | ${'extension'} | ${'varType-extension'}
  `('if "$varType" and "$extension" then "$expectedRes"', ({ varType, extension, expectedRes }) => {
    const res = ConfigUtils.buildExtendedVarType(varType, extension);
    expect(res).toStrictEqual(expectedRes);
  });
});
