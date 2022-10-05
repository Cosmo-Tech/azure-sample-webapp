// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SecurityUtils } from '../SecurityUtils';

describe('getPermissionsFromRole', () => {
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
    role         | rolesToPermissionsMapping    | consoleWarnCalls | expectedRes
    ${null}      | ${null}                      | ${1}             | ${[]}
    ${null}      | ${undefined}                 | ${1}             | ${[]}
    ${undefined} | ${null}                      | ${1}             | ${[]}
    ${undefined} | ${undefined}                 | ${1}             | ${[]}
    ${null}      | ${{}}                        | ${1}             | ${[]}
    ${[]}        | ${null}                      | ${1}             | ${[]}
    ${[]}        | ${{}}                        | ${0}             | ${[]}
    ${[]}        | ${rolesToPermissionsMapping} | ${0}             | ${[]}
    ${'admin'}   | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage']}
    ${'writer'}  | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write']}
    ${'reader'}  | ${rolesToPermissionsMapping} | ${0}             | ${['read']}
    ${'guest'}   | ${rolesToPermissionsMapping} | ${0}             | ${[]}
    ${'other'}   | ${rolesToPermissionsMapping} | ${0}             | ${['other']}
  `(
    'with parameters "$role" and "$rolesToPermissionsMapping" then "$expectedRes"',
    ({ role, rolesToPermissionsMapping, consoleWarnCalls, expectedRes }) => {
      const res = SecurityUtils.getPermissionsFromRole(role, rolesToPermissionsMapping);
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
    const res = SecurityUtils.transposeMappingDict(mappingDict);
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
      const res = SecurityUtils.getRolesGrantingPermission(permission, mappingDict);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getUserRoleForResource with invalid parameters', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const validUserId = 'unknownUser';
  const validSecurity = 'reader';
  const validACL = [{ id: 'alice', role: 'reader' }];

  for (const userIdentifier of [null, undefined, validUserId]) {
    for (const defaultSecurity of [null, undefined, '', validSecurity]) {
      for (const acl of [null, undefined, [], validACL]) {
        const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
        let expectedRes = null;
        if (defaultSecurity != null && userIdentifier != null) {
          expectedRes = defaultSecurity;
        }
        test(`with
          id: ${userIdentifier},
          default security: ${JSON.stringify(defaultSecurity)},
          acl: ${JSON.stringify(acl)}`, () => {
          expect(SecurityUtils.getUserRoleForResource(resourceSecurity, userIdentifier)).toStrictEqual(expectedRes);

          // A warning must be shown when user id is invalid
          let warnCounts = 0;
          if (userIdentifier !== validUserId) ++warnCounts;
          expect(spyConsoleWarn).toHaveBeenCalledTimes(warnCounts);
        });
      }
    }
  }
});

describe('getUserRoleForResource with valid parameters', () => {
  const aclAliceNoRole = [{ id: 'alice', role: null }];
  const aclAliceReader = [{ id: 'alice', role: 'reader' }];
  const aclAliceWriter = [{ id: 'alice', role: 'writer' }];
  const aclAliceAndBobWriters = [
    { id: 'alice', role: 'writer' },
    { id: 'bob', role: 'writer' },
  ];

  test.each`
    userIdentifier | defaultSecurity | acl                      | expectedRes
    ${'alice'}     | ${null}         | ${null}                  | ${null}
    ${'alice'}     | ${'reader'}     | ${null}                  | ${'reader'}
    ${'alice'}     | ${'writer'}     | ${null}                  | ${'writer'}
    ${'alice'}     | ${null}         | ${aclAliceNoRole}        | ${null}
    ${'alice'}     | ${'reader'}     | ${aclAliceNoRole}        | ${null}
    ${'alice'}     | ${'writer'}     | ${aclAliceNoRole}        | ${null}
    ${'alice'}     | ${null}         | ${aclAliceReader}        | ${'reader'}
    ${'alice'}     | ${'reader'}     | ${aclAliceReader}        | ${'reader'}
    ${'alice'}     | ${'writer'}     | ${aclAliceReader}        | ${'reader'}
    ${'alice'}     | ${null}         | ${aclAliceWriter}        | ${'writer'}
    ${'alice'}     | ${'reader'}     | ${aclAliceWriter}        | ${'writer'}
    ${'alice'}     | ${'writer'}     | ${aclAliceWriter}        | ${'writer'}
    ${'alice'}     | ${null}         | ${aclAliceAndBobWriters} | ${'writer'}
    ${'alice'}     | ${'reader'}     | ${aclAliceAndBobWriters} | ${'writer'}
    ${'alice'}     | ${'writer'}     | ${aclAliceAndBobWriters} | ${'writer'}
    ${'bob'}       | ${null}         | ${aclAliceNoRole}        | ${null}
    ${'bob'}       | ${'reader'}     | ${aclAliceNoRole}        | ${'reader'}
    ${'bob'}       | ${'writer'}     | ${aclAliceNoRole}        | ${'writer'}
  `(
    'with userIdentifier "$userIdentifier", defaultSecurity "$defaultSecurity", and acl "$acl", then "$expectedRes"',
    ({ userIdentifier, defaultSecurity, acl, expectedRes }) => {
      const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
      const res = SecurityUtils.getUserRoleForResource(resourceSecurity, userIdentifier);
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
  const validACL = [{ id: 'alice', role: 'reader' }];
  const validMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };

  for (const userIdentifier of [null, undefined, validUserId]) {
    for (const defaultSecurity of [null, undefined, '', validSecurity]) {
      for (const acl of [null, undefined, [], validACL]) {
        for (const mapping of [null, undefined, {}, validMapping]) {
          const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
          let expectedRes = [];
          if (defaultSecurity === validSecurity && userIdentifier === validUserId && mapping === validMapping) {
            expectedRes = ['read'];
          }
          test(`with
            id: ${userIdentifier},
            default security: ${JSON.stringify(defaultSecurity)},
            acl: ${JSON.stringify(acl)}
            mapping: ${JSON.stringify(mapping)}
            expected: ${JSON.stringify(expectedRes)}`, () => {
            expect(
              SecurityUtils.getUserPermissionsForResource(resourceSecurity, userIdentifier, mapping)
            ).toStrictEqual(expectedRes);

            // A first warning must be shown when user id is invalid, and another one when the mmapping is null
            let warnCounts = 0;
            if (resourceSecurity == null || mapping == null || userIdentifier == null) ++warnCounts;
            expect(spyConsoleWarn).toHaveBeenCalledTimes(warnCounts);
          });
        }
      }
    }
  }
});

describe('getUserPermissionsForResource with valid parameters', () => {
  const aclAliceNoRole = [{ id: 'alice', role: null }];
  const aclAliceReader = [{ id: 'alice', role: 'reader' }];
  const aclAliceWriter = [{ id: 'alice', role: 'writer' }];
  const aclAliceAndBobWriters = [
    { id: 'alice', role: 'writer' },
    { id: 'bob', role: 'writer' },
  ];

  const rolesToPermissionsMapping = {
    writer: ['read', 'write'],
    reader: ['read'],
  };
  const readerLevelPermissions = ['read'];
  const writerLevelPermissions = ['read', 'write'];

  test.each`
    userIdentifier | defaultSecurity | acl                      | expectedRes
    ${'alice'}     | ${null}         | ${null}                  | ${[]}
    ${'alice'}     | ${'reader'}     | ${null}                  | ${readerLevelPermissions}
    ${'alice'}     | ${'writer'}     | ${null}                  | ${writerLevelPermissions}
    ${'alice'}     | ${null}         | ${aclAliceNoRole}        | ${[]}
    ${'alice'}     | ${'reader'}     | ${aclAliceNoRole}        | ${[]}
    ${'alice'}     | ${'writer'}     | ${aclAliceNoRole}        | ${[]}
    ${'alice'}     | ${null}         | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${'reader'}     | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${'writer'}     | ${aclAliceReader}        | ${readerLevelPermissions}
    ${'alice'}     | ${null}         | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${'reader'}     | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${'writer'}     | ${aclAliceWriter}        | ${writerLevelPermissions}
    ${'alice'}     | ${null}         | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'alice'}     | ${'reader'}     | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'alice'}     | ${'writer'}     | ${aclAliceAndBobWriters} | ${writerLevelPermissions}
    ${'bob'}       | ${null}         | ${aclAliceNoRole}        | ${[]}
    ${'bob'}       | ${'reader'}     | ${aclAliceNoRole}        | ${readerLevelPermissions}
    ${'bob'}       | ${'writer'}     | ${aclAliceNoRole}        | ${writerLevelPermissions}
  `(
    'with userIdentifier "$userIdentifier", defaultSecurity "$defaultSecurity", and acl "$acl", then "$expectedRes"',
    ({ userIdentifier, defaultSecurity, acl, expectedRes }) => {
      const resourceSecurity = { default: defaultSecurity, accessControlList: acl };
      const res = SecurityUtils.getUserPermissionsForResource(
        resourceSecurity,
        userIdentifier,
        rolesToPermissionsMapping
      );
      expect(res).toStrictEqual(expectedRes);
    }
  );
});
