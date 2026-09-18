// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from '../SecurityUtils';
import {
  ORGANIZATION_PERMISSIONS,
  EXPECTED_PERMISSIONS_MAPPING,
  EXPECTED_PERMISSIONS,
  EXPECTED_ROLES,
} from './fixtures/OrganizationPermissions';

describe('areAccessControlListsIdentical', () => {
  const aclA1 = [
    { id: 'foo', role: 'role' },
    { id: 'bar', role: 'role' },
  ];
  const aclA2 = [
    { id: 'bar', role: 'role' },
    { role: 'role', id: 'foo' },
  ];
  const aclB = [
    { id: 'foo', role: 'anotherRole' },
    { id: 'bar', role: 'role' },
  ];
  const aclC = [
    { id: 'foo', role: 'role' },
    { id: 'bar', role: 'role' },
    { id: 'baz', role: 'role' },
  ];
  const aclD = [];

  test('with identical ACLs', () => {
    expect(SecurityUtils.areAccessControlListsIdentical(aclA1, aclA1)).toStrictEqual(true);
    expect(SecurityUtils.areAccessControlListsIdentical(aclA1, aclA2)).toStrictEqual(true);
  });

  test('with different ACLs', () => {
    expect(SecurityUtils.areAccessControlListsIdentical(aclA1, aclB)).toStrictEqual(false);
    expect(SecurityUtils.areAccessControlListsIdentical(aclA1, aclC)).toStrictEqual(false);
    expect(SecurityUtils.areAccessControlListsIdentical(aclA1, aclD)).toStrictEqual(false);
  });
});

describe('compareAccessControlLists', () => {
  const aclA1 = [
    { id: 'foo', role: 'role' },
    { id: 'bar', role: 'role' },
  ];
  const aclA2 = [
    { id: 'bar', role: 'role' },
    { role: 'role', id: 'foo' },
  ];
  const aclB = [
    { id: 'foo', role: 'anotherRole' },
    { id: 'bar', role: 'role' },
  ];
  const aclC = [
    { id: 'foo', role: 'role' },
    { id: 'bar', role: 'role' },
    { id: 'baz', role: 'role' },
  ];
  const aclD = [];

  test('with identical ACLs', () => {
    let { usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(aclA1, aclA1);
    expect(usersToAdd).toStrictEqual([]);
    expect(usersToModify).toStrictEqual([]);
    expect(usersToRemove).toStrictEqual([]);
    ({ usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(aclA1, aclA2));
    expect(usersToAdd).toStrictEqual([]);
    expect(usersToModify).toStrictEqual([]);
    expect(usersToRemove).toStrictEqual([]);
  });

  test('with different ACLs', () => {
    let { usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(aclA1, aclB);
    expect(usersToAdd).toStrictEqual([]);
    expect(usersToModify).toStrictEqual([{ id: 'foo', role: 'anotherRole' }]);
    expect(usersToRemove).toStrictEqual([]);

    ({ usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(aclA1, aclC));
    expect(usersToAdd).toStrictEqual([{ id: 'baz', role: 'role' }]);
    expect(usersToModify).toStrictEqual([]);
    expect(usersToRemove).toStrictEqual([]);

    ({ usersToAdd, usersToModify, usersToRemove } = SecurityUtils.compareAccessControlLists(aclA1, aclD));
    expect(usersToAdd).toStrictEqual([]);
    expect(usersToModify).toStrictEqual([]);
    expect(usersToRemove).toStrictEqual([
      { id: 'foo', role: 'role' },
      { id: 'bar', role: 'role' },
    ]);
  });
});

describe('getUsersIdsFromACL', () => {
  const aclA1 = [
    { id: 'foo', role: 'role' },
    { id: 'bar', role: 'role' },
  ];
  const aclA2 = [
    { id: 'bar', role: 'role' },
    { role: 'role', id: 'foo' },
  ];
  const aclD = [];

  test('with valid ACLs', () => {
    expect(SecurityUtils.getUsersIdsFromACL(aclA1)).toStrictEqual(['foo', 'bar']);
    expect(SecurityUtils.getUsersIdsFromACL(aclA2)).toStrictEqual(['bar', 'foo']);
    expect(SecurityUtils.getUsersIdsFromACL(aclD)).toStrictEqual([]);
  });
});

describe('getPermissionsFromRole', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
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
    ${'AdMin'}   | ${rolesToPermissionsMapping} | ${0}             | ${['read', 'write', 'manage']}
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

  afterEach(() => {
    spyConsoleWarn.mockClear();
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

  afterEach(() => {
    spyConsoleWarn.mockClear();
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

describe('getUserRoleFromSecurity with invalid parameters', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
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
          expect(SecurityUtils.getUserRoleFromSecurity(resourceSecurity, userIdentifier)).toStrictEqual(expectedRes);

          // A warning must be shown when user id is invalid
          let warnCounts = 0;
          if (userIdentifier !== validUserId) ++warnCounts;
          expect(spyConsoleWarn).toHaveBeenCalledTimes(warnCounts);
        });
      }
    }
  }
});

describe('getUserRoleFromSecurity with valid parameters', () => {
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
      const res = SecurityUtils.getUserRoleFromSecurity(resourceSecurity, userIdentifier);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getUserPermissionsForResource with invalid parameters', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  const validUserId = 'unknownUser';
  const validDefaultRole = 'reader';
  const validACL = [{ id: 'alice', role: 'reader' }];
  const validMapping = {
    admin: ['read', 'write', 'manage'],
    writer: ['read', 'write'],
    reader: ['read'],
    guest: [],
    other: ['other'],
  };
  const orderedRoles = ['admin', 'writer', 'reader', 'other', 'guest'];

  for (const userIdentifier of [null, undefined, validUserId]) {
    for (const defaultSecurity of [null, undefined, '', validDefaultRole]) {
      for (const acl of [null, undefined, [], validACL]) {
        for (const mapping of [null, undefined, {}, validMapping]) {
          const resource = { security: { default: defaultSecurity, accessControlList: acl } };
          let expectedRes = [];
          if (defaultSecurity === validDefaultRole && userIdentifier === validUserId && mapping === validMapping) {
            expectedRes = ['read'];
          }
          test(`with
            id: ${userIdentifier},
            default security: ${JSON.stringify(defaultSecurity)},
            acl: ${JSON.stringify(acl)}
            mapping: ${JSON.stringify(mapping)}
            expected: ${JSON.stringify(expectedRes)}`, () => {
            expect(
              SecurityUtils.getUserPermissionsForResource(resource, userIdentifier, mapping, orderedRoles)
            ).toStrictEqual(expectedRes);

            // A first warning must be shown when user id is invalid, and another one when the mapping is null
            let warnCounts = 0;
            if (resource == null || mapping == null || userIdentifier == null) ++warnCounts;
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
  const orderedRoles = ['writer', 'reader'];
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
      const resource = { security: { default: defaultSecurity, accessControlList: acl } };
      const res = SecurityUtils.getUserPermissionsForResource(
        resource,
        userIdentifier,
        rolesToPermissionsMapping,
        orderedRoles
      );
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('parseOrganizationPermissions with valid parameters', () => {
  test('with identical ACLs', () => {
    const { roles, permissions, permissionsMapping } =
      SecurityUtils.parseOrganizationPermissions(ORGANIZATION_PERMISSIONS);
    expect(roles).toStrictEqual(EXPECTED_ROLES);
    expect(permissions).toStrictEqual(EXPECTED_PERMISSIONS);
    expect(permissionsMapping).toStrictEqual(EXPECTED_PERMISSIONS_MAPPING);
  });
});

describe('sortByNewAdminsFirst', () => {
  const adminA1 = { id: 'A1', role: 'admin' };
  const adminA2 = { id: 'A2', role: 'admin' };
  const viewerV1 = { id: 'V1', role: 'viewer' };
  const viewerV2 = { id: 'V2', role: 'viewer' };

  test('with an empty list', () => {
    const list = [];
    SecurityUtils.sortByNewAdminsFirst(list);
    expect(list).toStrictEqual([]);
  });

  test('with an already sorted list', () => {
    const list = [adminA1, adminA2, viewerV1, viewerV2];
    SecurityUtils.sortByNewAdminsFirst(list);
    expect(list).toStrictEqual([adminA1, adminA2, viewerV1, viewerV2]);
  });

  test('with a non-sorted list', () => {
    const list = [viewerV1, viewerV2, adminA2, adminA1];
    SecurityUtils.sortByNewAdminsFirst(list);
    expect(list).toStrictEqual([adminA2, adminA1, viewerV1, viewerV2]); // A2 then A1 order should remain
  });
});

describe('getHighestRole', () => {
  test('it supports null-ish and empty parameters', () => {
    expect(SecurityUtils.getHighestRole()).toStrictEqual('none');
    expect(SecurityUtils.getHighestRole(null, null)).toStrictEqual('none');
    expect(SecurityUtils.getHighestRole(undefined, undefined)).toStrictEqual('none');
    expect(SecurityUtils.getHighestRole('', '')).toStrictEqual('none');

    expect(SecurityUtils.getHighestRole('admin')).toStrictEqual('admin');
    expect(SecurityUtils.getHighestRole('admin', null)).toStrictEqual('admin');
    expect(SecurityUtils.getHighestRole('admin', undefined)).toStrictEqual('admin');
    expect(SecurityUtils.getHighestRole('admin', '')).toStrictEqual('admin');
  });

  test('it returns the highest role', () => {
    for (const role of ['admin', 'validator', 'editor', 'user', 'viewer', 'none']) {
      expect(SecurityUtils.getHighestRole('admin', role)).toStrictEqual('admin');
      expect(SecurityUtils.getHighestRole(role, 'admin')).toStrictEqual('admin');
    }
    for (const role of ['validator', 'editor', 'user', 'viewer', 'none']) {
      expect(SecurityUtils.getHighestRole('validator', role)).toStrictEqual('validator');
      expect(SecurityUtils.getHighestRole(role, 'validator')).toStrictEqual('validator');
    }
    for (const role of ['editor', 'user', 'viewer', 'none']) {
      expect(SecurityUtils.getHighestRole('editor', role)).toStrictEqual('editor');
      expect(SecurityUtils.getHighestRole(role, 'editor')).toStrictEqual('editor');
    }
    for (const role of ['user', 'viewer', 'none']) {
      expect(SecurityUtils.getHighestRole('user', role)).toStrictEqual('user');
      expect(SecurityUtils.getHighestRole(role, 'user')).toStrictEqual('user');
    }
    for (const role of ['viewer', 'none']) {
      expect(SecurityUtils.getHighestRole('viewer', role)).toStrictEqual('viewer');
      expect(SecurityUtils.getHighestRole(role, 'viewer')).toStrictEqual('viewer');
    }
    expect(SecurityUtils.getHighestRole('none', 'none')).toStrictEqual('none');
  });
});

describe('getResourceUsersAndGroups', () => {
  test('it supports null-ish and empty parameters', () => {
    const expected = { users: [], groups: [] };
    expect(expected).toStrictEqual(SecurityUtils.getResourceUsersAndGroups());
    expect(expected).toStrictEqual(SecurityUtils.getResourceUsersAndGroups(null, null));
    expect(expected).toStrictEqual(SecurityUtils.getResourceUsersAndGroups(undefined, undefined));
    expect(expected).toStrictEqual(SecurityUtils.getResourceUsersAndGroups([], {}));
  });

  test('it correctly list groups and merges users from ACL and members', () => {
    const acl = [
      { id: 'admin@example.com', role: 'admin' },
      { id: 'serviceAccount', role: 'admin' },
      { id: 'myGroup', role: 'viewer' },
    ];
    const membersAndGroups = {
      users: [{ id: 'admin@example.com', role: 'admin' }],
      groups: [{ id: 'myGroup', role: 'viewer', users: ['viewer@example.com'] }],
    };
    const expected = {
      users: [
        { id: 'viewer@example.com', role: 'viewer' },
        { id: 'admin@example.com', role: 'admin' },
        { id: 'serviceAccount', role: 'admin' },
      ],
      groups: [{ id: 'myGroup', role: 'viewer', users: ['viewer@example.com'] }],
    };

    const actual = SecurityUtils.getResourceUsersAndGroups(acl, membersAndGroups);
    expect(expected).toStrictEqual(actual);
  });

  test('it correctly resolves the highest role', () => {
    const acl = [
      { id: 'shouldBeViewer@example.com', role: 'none' },
      { id: 'shouldBeAdmin@example.com', role: 'none' },
      { id: 'adminMemberOfAViewerGroup@example.com', role: 'admin' },
      { id: 'adminGroup', role: 'admin' },
      { id: 'viewerGroup', role: 'viewer' },
    ];
    const membersAndGroups = {
      users: [
        { id: 'shouldBeViewer@example.com', role: 'none' },
        { id: 'shouldBeAdmin@example.com', role: 'none' },
        { id: 'adminMemberOfAViewerGroup@example.com', role: 'admin' },
      ],
      groups: [
        { id: 'adminGroup', role: 'admin', users: ['shouldBeAdmin@example.com'] },
        {
          id: 'viewerGroup',
          role: 'viewer',
          users: ['adminMemberOfAViewerGroup@example.com', 'shouldBeViewer@example.com'],
        },
      ],
    };
    const expected = {
      users: [
        { id: 'shouldBeAdmin@example.com', role: 'admin' },
        { id: 'adminMemberOfAViewerGroup@example.com', role: 'admin' },
        { id: 'shouldBeViewer@example.com', role: 'viewer' },
      ],
      groups: [
        { id: 'adminGroup', role: 'admin', users: ['shouldBeAdmin@example.com'] },
        {
          id: 'viewerGroup',
          role: 'viewer',
          users: ['adminMemberOfAViewerGroup@example.com', 'shouldBeViewer@example.com'],
        },
      ],
    };

    const actual = SecurityUtils.getResourceUsersAndGroups(acl, membersAndGroups);
    expect(expected).toStrictEqual(actual);
  });
});
