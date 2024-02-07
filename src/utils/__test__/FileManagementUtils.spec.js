// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { FileManagementUtils } from '../FileManagementUtils';

describe('isFileValidFormat', () => {
  test.each`
    fileMIMEType                                                           | expectedRes
    ${'application/json'}                                                  | ${true}
    ${'application/zip'}                                                   | ${true}
    ${'application/xml'}                                                   | ${true}
    ${'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'} | ${true}
    ${'mats-officedocument.spreadsheetml.sheet'}                           | ${true}
    ${'application/x-tika-ooxml'}                                          | ${true}
    ${'text/csv'}                                                          | ${true}
    ${'text/plain'}                                                        | ${true}
    ${'text/x-yaml'}                                                       | ${true}
    ${'foo'}                                                               | ${false}
    ${'65sfag46xfb@hgsd6xgdv1$ê('}                                         | ${false}
    ${''}                                                                  | ${false}
    ${'    '}                                                              | ${false}
    ${56982}                                                               | ${false}
    ${'application/ecmascript'}                                            | ${false}
    ${'image/jpeg'}                                                        | ${false}
    ${'image/png'}                                                         | ${false}
    ${'image/bmp'}                                                         | ${false}
    ${'application/ogg'}                                                   | ${false}
    ${'audio/wav,'}                                                        | ${false}
    ${'audio/aac'}                                                         | ${false}
    ${'audio/midi'}                                                        | ${false}
    ${'video/mp4'}                                                         | ${false}
    ${'application/vnd.rar'}                                               | ${false}
    ${'application/xhtml+xml'}                                             | ${false}
    ${null}                                                                | ${false}
    ${undefined}                                                           | ${false}
  `('"$fileMIMEType" then "$expectedRes"', ({ fileMIMEType, expectedRes }) => {
    const res = FileManagementUtils.isFileFormatValid(fileMIMEType);
    expect(res).toStrictEqual(expectedRes);
  });
});
