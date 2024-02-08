// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import rfdc from 'rfdc';
import ShareCurrentScenarioButton from '.';
import { ROLES } from '../../../tests/constants';
import { createMockStore, MockFormProvider } from '../../../tests/mocks';
import { DEFAULT_REDUX_STATE, USERS_LIST } from '../../../tests/samples';
import { applyScenarioRoleToState } from '../../../tests/utils/security';
import { dispatchApplyScenarioSharingChanges } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const clone = rfdc();

let mockRoleEditionButtonProps;
jest.mock('@cosmotech/ui', () => ({
  ...jest.requireActual('@cosmotech/ui'),
  RolesEditionButton: (props) => {
    mockRoleEditionButtonProps = props;
    return <div data-testid="role_edition_button" />;
  },
}));

const getRolesEditionButton = () => screen.queryByTestId('role_edition_button');

const getStateWithScenarioRole = (role) => {
  const state = clone(DEFAULT_REDUX_STATE);
  applyScenarioRoleToState(state, role);
  return state;
};

let mockStore;

const setUp = (role) => {
  mockStore = createMockStore(getStateWithScenarioRole(role));

  render(
    <Provider store={mockStore}>
      <MockFormProvider>
        <ShareCurrentScenarioButton />
      </MockFormProvider>
    </Provider>
  );
};

describe('ShareCurrentScenarioButton', () => {
  describe('Scenario Roles', () => {
    beforeEach(() => {
      mockRoleEditionButtonProps = undefined;
    });

    test('None role dont display Share Scenario button', () => {
      setUp(ROLES.SCENARIO.NONE);
      expect(getRolesEditionButton()).not.toBeInTheDocument();
    });

    test.each([
      { role: ROLES.SCENARIO.ADMIN, expected: undefined },
      { role: ROLES.SCENARIO.EDITOR, expected: true },
      { role: ROLES.SCENARIO.VALIDATOR, expected: true },
      { role: ROLES.SCENARIO.VIEWER, expected: true },
    ])('$role role display Share Scenario button with isReadOnly $expected', ({ role, expected }) => {
      setUp(role);
      expect(getRolesEditionButton()).toBeInTheDocument();
      expect(mockRoleEditionButtonProps.isReadOnly).toEqual(expected);
    });
  });

  describe('Props of RoleEditionButton', () => {
    let storeState;
    beforeAll(() => {
      setUp(ROLES.SCENARIO.ADMIN);
      storeState = mockStore.getState();
    });

    afterAll(() => {
      mockRoleEditionButtonProps = undefined;
      mockStore.dispatch.mockClear();
    });

    test('agents prop match to current workspace users', () => {
      const workspaceUsers = storeState.workspace.current.data.users;
      workspaceUsers.forEach((user) => {
        expect(mockRoleEditionButtonProps.agents.some((agent) => agent.id === user)).toBeTruthy();
      });
    });

    test('resourceRolesPermissionsMapping match application scenario permission mapping', () => {
      const applicationScenarioPermissionMapping = storeState.application.permissionsMapping.scenario;
      expect(mockRoleEditionButtonProps.resourceRolesPermissionsMapping).toEqual(applicationScenarioPermissionMapping);
    });

    test('specificAccessByAgent match to current scenario accessControlList', () => {
      const currentScenarioAccessControlList = storeState.scenario.current.data.security.accessControlList;
      expect(mockRoleEditionButtonProps.specificAccessByAgent).toEqual(currentScenarioAccessControlList);
    });

    test('defaultRole match to current scenario default security', () => {
      const currentScenarioDefaultSecurity = storeState.scenario.current.data.security.default;
      expect(mockRoleEditionButtonProps.defaultRole).toEqual(currentScenarioDefaultSecurity);
    });

    test('allRoles contains all application scenario roles', () => {
      const applicationRoles = storeState.application.roles.scenario;
      applicationRoles.forEach((appRole) => {
        expect(mockRoleEditionButtonProps.allRoles.some((role) => role.value === appRole)).toBeTruthy();
      });
    });

    test('allPermissions contains all application scenario permissions', () => {
      const applicationPermission = storeState.application.permissions.scenario;
      applicationPermission.forEach((appPermission) => {
        expect(
          mockRoleEditionButtonProps.allPermissions.some((permission) => permission.value === appPermission)
        ).toBeTruthy();
      });
    });

    test('onConfirmChanges dispatch new security with current scenarioId', () => {
      const currentScenarioId = storeState.scenario.current.data.id;
      const newSecurity = [
        { id: USERS_LIST[1].email, role: ROLES.SCENARIO.ADMIN },
        { id: USERS_LIST[2].email, role: ROLES.SCENARIO.VALIDATOR },
      ];

      const actionExpected = dispatchApplyScenarioSharingChanges(currentScenarioId, newSecurity);
      mockRoleEditionButtonProps.onConfirmChanges(newSecurity);

      expect(mockStore.dispatch).toHaveBeenCalledWith(actionExpected);
    });
  });
});
