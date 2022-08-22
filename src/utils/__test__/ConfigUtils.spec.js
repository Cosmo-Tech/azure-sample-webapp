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

describe('getConversionMethod with possible values', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  function mockMethod(param) {
    return param;
  }

  function mockMethod2(param) {
    return param;
  }

  const arrayWithoutTypes = { noConversionMethod: true };
  const arrayWithVarType = { varType: mockMethod };
  const arrayWithExtendedVarType = { 'varType-extended': mockMethod2 };
  const arrayWithVarTypeAndWrongExtended = { varType: mockMethod, extended: mockMethod2 };
  const arrayWithBoth = { varType: mockMethod, 'varType-extended': mockMethod2 };

  test.each`
    param                      | subType       | functionArray                       | consoleWarnCalls | expectedRes
    ${null}                    | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${undefined}               | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${''}         | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${'extended'} | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${null}       | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${undefined}  | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithExtendedVarType}         | ${0}             | ${mockMethod2}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarTypeAndWrongExtended} | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithBoth}                    | ${0}             | ${mockMethod2}
  `(
    'if param "$param",subType "subType", functionArray "$functionArray"  ' +
      'and consoleWarnCalls "$consoleWarnCalls" then expectedRes "$expectedRes"',
    ({ param, subType, functionArray, consoleWarnCalls, expectedRes }) => {
      const res = ConfigUtils.getConversionMethod(param, subType, functionArray);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getParameterSubType with possible values', () => {
  const configWithExtended = { parameterId: { varType: 'varType', subType: 'extended' } };
  const configWithoutExtended = { parameterId: { varType: 'varType' } };

  test.each`
    parameterId      | configParameters         | expectedRes
    ${null}          | ${null}                  | ${undefined}
    ${null}          | ${undefined}             | ${undefined}
    ${null}          | ${''}                    | ${undefined}
    ${null}          | ${{}}                    | ${undefined}
    ${undefined}     | ${null}                  | ${undefined}
    ${undefined}     | ${undefined}             | ${undefined}
    ${undefined}     | ${''}                    | ${undefined}
    ${undefined}     | ${{}}                    | ${undefined}
    ${''}            | ${null}                  | ${undefined}
    ${''}            | ${undefined}             | ${undefined}
    ${''}            | ${''}                    | ${undefined}
    ${''}            | ${{}}                    | ${undefined}
    ${'parameter'}   | ${null}                  | ${undefined}
    ${'parameter'}   | ${undefined}             | ${undefined}
    ${'parameter'}   | ${''}                    | ${undefined}
    ${'parameter'}   | ${{}}                    | ${undefined}
    ${'parameter'}   | ${{ withoutParam: '' }}  | ${undefined}
    ${'parameterId'} | ${configWithoutExtended} | ${undefined}
    ${'parameterId'} | ${configWithExtended}    | ${'extended'}
  `(
    'if "$parameterId" and "$configParameters" then "$expectedRes"',
    ({ parameterId, configParameters, expectedRes }) => {
      const res = ConfigUtils.getParameterSubType(parameterId, configParameters);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getPermissionsFromRoles', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const rolesToPermissionsMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };

  test.each`
    roles                  | rolesToPermissionsMapping    | consoleWarnCalls | expectedRes
    ${null}                | ${null}                      | ${1}             | ${[]}
    ${null}                | ${undefined}                 | ${1}             | ${[]}
    ${undefined}           | ${null}                      | ${1}             | ${[]}
    ${undefined}           | ${undefined}                 | ${1}             | ${[]}
    ${null}                | ${{}}                        | ${1}             | ${[]}
    ${[]}                  | ${null}                      | ${1}             | ${[]}
    ${[]}                  | ${{}}                        | ${0}             | ${[]}
    ${[]}                  | ${rolesToPermissionsMapping} | ${0}             | ${[]}
    ${['admin']}           | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage']}
    ${['writer']}          | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write']}
    ${['reader']}          | ${rolesToPermissionsMapping} | ${0}             | ${['read']}
    ${['guest']}           | ${rolesToPermissionsMapping} | ${0}             | ${[]}
    ${['admin', 'reader']} | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage']}
    ${['admin', 'guest']}  | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage']}
    ${['admin', 'other']}  | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage', 'other']}
  `(
    'with parameters "$roles" and "$rolesToPermissionsMapping" then "$expectedRes"',
    ({ roles, rolesToPermissionsMapping, consoleWarnCalls, expectedRes }) => {
      const res = ConfigUtils.getPermissionsFromRoles(roles, rolesToPermissionsMapping);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('transposeMappingDict', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const rolesToPermissionsMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };
  const expectedTransposedMapping = {
    read: ['admin', 'writer', 'reader'],
    write: ['admin', 'writer'],
    manage: ['admin'],
    other: ['other'],
  };

  test.each`
    mappingDict                  | consoleWarnCalls | expectedRes
    ${null}                      | ${1}             | ${{}}
    ${undefined}                 | ${1}             | ${{}}
    ${{}}                        | ${0}             | ${{}}
    ${rolesToPermissionsMapping} | ${0}             | ${expectedTransposedMapping}
  `('with mapping dict "$mappingDict" then "$expectedRes"', ({ mappingDict, consoleWarnCalls, expectedRes }) => {
    const res = ConfigUtils.transposeMappingDict(mappingDict);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('getRolesGrantingPermission', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const rolesToPermissionsMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };
  const transposedMapping = {
    read: ['admin', 'writer', 'reader'],
    write: ['admin', 'writer'],
    manage: ['admin'],
    other: ['other'],
  };

  test.each`
    permission   | mappingDict                  | consoleWarnCalls | expectedRes
    ${null}      | ${null}                      | ${1}             | ${[]}
    ${null}      | ${undefined}                 | ${1}             | ${[]}
    ${undefined} | ${null}                      | ${1}             | ${[]}
    ${undefined} | ${undefined}                 | ${1}             | ${[]}
    ${null}      | ${{}}                        | ${1}             | ${[]}
    ${'read'}    | ${rolesToPermissionsMapping} | ${0}             | ${transposedMapping.read}
    ${'write'}   | ${rolesToPermissionsMapping} | ${0}             | ${transposedMapping.write}
    ${'manage'}  | ${rolesToPermissionsMapping} | ${0}             | ${transposedMapping.manage}
    ${'other'}   | ${rolesToPermissionsMapping} | ${0}             | ${transposedMapping.other}
    ${'unknown'} | ${rolesToPermissionsMapping} | ${1}             | ${[]}
  `(
    'with permission "$permission", mapping dict "$mappingDict" then "$expectedRes"',
    ({ permission, mappingDict, consoleWarnCalls, expectedRes }) => {
      const res = ConfigUtils.getRolesGrantingPermission(permission, mappingDict);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getUserRolesForResource with invalid parameters', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const validUserId = 'unknownUser';
  const validSecurity = ['reader'];
  const validACL = [{ id: 'alice', roles: ['reader'] }];

  for (const userIdentifier of [null, undefined, validUserId]) {
    for (const defaultSecurity of [null, undefined, [], validSecurity]) {
      for (const acl of [null, undefined, [], validACL]) {
        const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
        test(`with
          id: ${userIdentifier},
          default security: ${JSON.stringify(defaultSecurity)},
          acl: ${JSON.stringify(acl)}`, () => {
          let expectedRes = [];
          if (defaultSecurity === validSecurity && userIdentifier === validUserId) {
            expectedRes = validSecurity;
          }
          expect(ConfigUtils.getUserRolesForResource(resourceSecurity, userIdentifier)).toStrictEqual(expectedRes);

          // A warning must be shown when user id is invalid
          let warnCounts = 0;
          if (userIdentifier !== validUserId) ++warnCounts;
          expect(spyConsoleWarn).toHaveBeenCalledTimes(warnCounts);
        });
      }
    }
  }
});

describe('getUserRolesForResource with valid parameters', () => {
  const noRoles = [];
  const readerLevelRoles = ['reader'];
  const writerLevelRoles = ['reader', 'writer'];
  const aclAliceNoRoles = [{ id: 'alice', roles: noRoles }];
  const aclAliceReader = [{ id: 'alice', roles: readerLevelRoles }];
  const aclAliceWriter = [{ id: 'alice', roles: writerLevelRoles }];
  const aclAliceAndBobWriters = [
    { id: 'alice', roles: writerLevelRoles },
    { id: 'bob', roles: writerLevelRoles },
  ];

  test.each`
    userIdentifier | defaultSecurity     | acl                      | expectedRes
    ${'alice'}     | ${noRoles}          | ${noRoles}               | ${[]}
    ${'alice'}     | ${readerLevelRoles} | ${noRoles}               | ${readerLevelRoles}
    ${'alice'}     | ${writerLevelRoles} | ${noRoles}               | ${writerLevelRoles}
    ${'alice'}     | ${noRoles}          | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${noRoles}          | ${aclAliceReader}        | ${readerLevelRoles}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceReader}        | ${readerLevelRoles}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceReader}        | ${readerLevelRoles}
    ${'alice'}     | ${noRoles}          | ${aclAliceWriter}        | ${writerLevelRoles}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceWriter}        | ${writerLevelRoles}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceWriter}        | ${writerLevelRoles}
    ${'alice'}     | ${noRoles}          | ${aclAliceAndBobWriters} | ${writerLevelRoles}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceAndBobWriters} | ${writerLevelRoles}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceAndBobWriters} | ${writerLevelRoles}
    ${'bob'}       | ${noRoles}          | ${aclAliceNoRoles}       | ${[]}
    ${'bob'}       | ${readerLevelRoles} | ${aclAliceNoRoles}       | ${readerLevelRoles}
    ${'bob'}       | ${writerLevelRoles} | ${aclAliceNoRoles}       | ${writerLevelRoles}
  `(
    'with userIdentifier "$userIdentifier", defaultSecurity "$defaultSecurity", and acl "$acl", then "$expectedRes"',
    ({ userIdentifier, defaultSecurity, acl, expectedRes }) => {
      const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
      const res = ConfigUtils.getUserRolesForResource(resourceSecurity, userIdentifier);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getUserPermissionsForResource with invalid parameters', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const validUserId = 'unknownUser';
  const validSecurity = ['reader'];
  const validACL = [{ id: 'alice', roles: ['reader'] }];
  const validMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };

  for (const userIdentifier of [null, undefined, validUserId]) {
    for (const defaultSecurity of [null, undefined, [], validSecurity]) {
      for (const acl of [null, undefined, [], validACL]) {
        for (const mapping of [null, undefined, {}, validMapping]) {
          const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
          test(`with
            id: ${userIdentifier},
            default security: ${JSON.stringify(defaultSecurity)},
            acl: ${JSON.stringify(acl)}
            mapping: ${JSON.stringify(mapping)}`, () => {
            let expectedRes = [];
            if (defaultSecurity === validSecurity && userIdentifier === validUserId && mapping === validMapping) {
              expectedRes = ['read'];
            }
            expect(ConfigUtils.getUserPermissionsForResource(resourceSecurity, userIdentifier, mapping)).toStrictEqual(
              expectedRes
            );

            // A first warning must be shown when user id is invalid, and another one when the mmapping is null
            let warnCounts = 0;
            if (userIdentifier !== validUserId) ++warnCounts;
            if (mapping == null) ++warnCounts;
            expect(spyConsoleWarn).toHaveBeenCalledTimes(warnCounts);
          });
        }
      }
    }
  }
});

describe('getUserPermissionsForResource with valid parameters', () => {
  const noRoles = [];
  const readerLevelRoles = ['reader'];
  const writerLevelRoles = ['reader', 'writer'];
  const aclAliceNoRoles = [{ id: 'alice', roles: noRoles }];
  const aclAliceReader = [{ id: 'alice', roles: readerLevelRoles }];
  const aclAliceWriter = [{ id: 'alice', roles: writerLevelRoles }];
  const aclAliceAndBobWriters = [
    { id: 'alice', roles: writerLevelRoles },
    { id: 'bob', roles: writerLevelRoles },
  ];

  const rolesToPermissionsMapping = {
    writer: ['read', 'write'],
    reader: ['read'],
  };
  const readerLevelPermissions = ['read'];
  const writerLevelPermissions = ['read', 'write'];

  test.each`
    userIdentifier | defaultSecurity     | acl                      | expectedRes
    ${'alice'}     | ${noRoles}          | ${noRoles}               | ${[]}
    ${'alice'}     | ${readerLevelRoles} | ${noRoles}               | ${readerLevelPermissions}
    ${'alice'}     | ${writerLevelRoles} | ${noRoles}               | ${writerLevelPermissions}
    ${'alice'}     | ${noRoles}          | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceNoRoles}       | ${[]}
    ${'alice'}     | ${noRoles}          | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${noRoles}          | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${noRoles}          | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'alice'}     | ${readerLevelRoles} | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'alice'}     | ${writerLevelRoles} | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'bob'}       | ${noRoles}          | ${aclAliceNoRoles}       | ${[]}
    ${'bob'}       | ${readerLevelRoles} | ${aclAliceNoRoles}       | ${readerLevelPermissions}
    ${'bob'}       | ${writerLevelRoles} | ${aclAliceNoRoles}       | ${writerLevelPermissions}
  `(
    'with userIdentifier "$userIdentifier", defaultSecurity "$defaultSecurity", and acl "$acl", then "$expectedRes"',
    ({ userIdentifier, defaultSecurity, acl, expectedRes }) => {
      const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
      const res = ConfigUtils.getUserPermissionsForResource(
        resourceSecurity,
        userIdentifier,
        rolesToPermissionsMapping
      );
      expect(res).toStrictEqual(expectedRes);
    }
  );
});
