// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SchemasUtils } from '../schemas/SchemasUtils';

describe('schema generation for custom options', () => {
  test.each`
    options                                | expectedKeys
    ${['option']}                          | ${['option']}
    ${['option1', 'option2']}              | ${['option1', 'option2']}
    ${undefined}                           | ${[]}
    ${null}                                | ${[]}
    ${[]}                                  | ${[]}
    ${'option'}                            | ${[]}
    ${['option1', ['option2', 'option3']]} | ${['option1', 'option2', 'option3']}
    ${[1, 2, 3]}                           | ${['1', '2', '3']}
  `('schema is generated for custom options', ({ options, expectedKeys }) => {
    const optionObject = SchemasUtils.getCustomOptionsZodObject(options);
    const keySchema = optionObject.keyof();
    expect(keySchema._def.values).toStrictEqual(expectedKeys);
  });
});
