// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { StringUtils } from '../StringUtils';

describe('trimTrailingSlashes', () => {
  test.each`
    input                         | expectedRes
    ${''}                         | ${''}
    ${'/'}                        | ${''}
    ${'///'}                      | ${''}
    ${'a'}                        | ${'a'}
    ${'a/'}                       | ${'a'}
    ${'a//'}                      | ${'a'}
    ${'a/b'}                      | ${'a/b'}
    ${'a/b///'}                   | ${'a/b'}
    ${'/a'}                       | ${'/a'}
    ${'https://example.com/api/'} | ${'https://example.com/api'}
    ${null}                       | ${undefined}
    ${undefined}                  | ${undefined}
  `('input string "$input" should return "$expectedRes"', ({ input, expectedRes }) => {
    expect(StringUtils.trimTrailingSlashes(input)).toBe(expectedRes);
  });
});
