// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { TranslationUtils } from '../TranslationUtils';

describe('strings are successfully escaped and decoded', () => {
  test.each`
    string          | expectedRes
    ${'26/12/2019'} | ${'26&#x2F;12&#x2F;2019'}
    ${'M&M'}        | ${'M&amp;M'}
    ${'>.<'}        | ${'&gt;.&lt;'}
    ${'"toto"'}     | ${'&quot;toto&quot;'}
    ${"'toto'"}     | ${'&#39;toto&#39;'}
  `('string equals expectedRes', ({ string, expectedRes }) => {
    const res = TranslationUtils.getStringWithEscapedCharacters(string);
    expect(res).toStrictEqual(expectedRes);
  });
  test.each`
    string                    | expectedRes
    ${'26&#x2F;12&#x2F;2019'} | ${'26/12/2019'}
    ${'M&amp;M'}              | ${'M&M'}
    ${'&gt;.&lt;'}            | ${'>.<'}
    ${'&quot;toto&quot;'}     | ${'"toto"'}
    ${'&#39;toto&#39;'}       | ${"'toto'"}
  `('string equals expectedRes', ({ string, expectedRes }) => {
    const res = TranslationUtils.getStringWithUnescapedCharacters(string);
    expect(res).toStrictEqual(expectedRes);
  });
});
