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
import { dispatchApplyRunnerSharingChanges } from '../../state/runner/dispatchers';

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

    test.each([{ role: ROLES.RUNNER.NONE }, { role: ROLES.RUNNER.VIEWER }])(
      'must show a disabled button when role is $role',
      ({ role }) => {
        setUp(role);
        expect(getRolesEditionButton()).toBeInTheDocument();
        expect(mockRoleEditionButtonProps.disabled).toEqual(true);
      }
    );

    test.each([
      { role: ROLES.RUNNER.ADMIN, expected: false },
      { role: ROLES.RUNNER.EDITOR, expected: true },
      { role: ROLES.RUNNER.VALIDATOR, expected: true },
    ])('$role role display Share Scenario button with isReadOnly $expected', ({ role, expected }) => {
      setUp(role);
      expect(getRolesEditionButton()).toBeInTheDocument();
      expect(mockRoleEditionButtonProps.disabled).toEqual(false);
      expect(mockRoleEditionButtonProps.isReadOnly).toEqual(expected);
    });
  });

  describe('Props of RoleEditionButton', () => {
    let storeState;
    beforeAll(() => {
      setUp(ROLES.RUNNER.ADMIN);
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
      const applicationScenarioPermissionMapping = storeState.application.permissionsMapping.runner;
      expect(mockRoleEditionButtonProps.resourceRolesPermissionsMapping).toEqual(applicationScenarioPermissionMapping);
    });

    test('specificAccessByAgent match to current scenario accessControlList', () => {
      const currentScenarioAccessControlList =
        storeState.runner.simulationRunners.current.data.security.accessControlList;
      expect(mockRoleEditionButtonProps.specificAccessByAgent).toEqual(currentScenarioAccessControlList);
    });

    test('defaultRole match to current scenario default security', () => {
      const currentScenarioDefaultSecurity = storeState.runner.simulationRunners.current.data.security.default;
      expect(mockRoleEditionButtonProps.defaultRole).toEqual(currentScenarioDefaultSecurity);
    });

    test('allRoles contains all application scenario roles', () => {
      const applicationRoles = storeState.application.roles.runner;
      applicationRoles.forEach((appRole) => {
        expect(mockRoleEditionButtonProps.allRoles.some((role) => role.value === appRole)).toBeTruthy();
      });
    });

    test('allPermissions contains all application scenario permissions', () => {
      const applicationPermission = storeState.application.permissions.runner;
      applicationPermission.forEach((appPermission) => {
        expect(
          mockRoleEditionButtonProps.allPermissions.some((permission) => permission.value === appPermission)
        ).toBeTruthy();
      });
    });

    test('onConfirmChanges dispatch new security with current scenarioId', () => {
      const currentScenarioId = storeState.runner.simulationRunners.current.data.id;
      const newSecurity = [
        { id: USERS_LIST[1].email, role: ROLES.RUNNER.ADMIN },
        { id: USERS_LIST[2].email, role: ROLES.RUNNER.VALIDATOR },
      ];

      const actionExpected = dispatchApplyRunnerSharingChanges(currentScenarioId, newSecurity);
      mockRoleEditionButtonProps.onConfirmChanges(newSecurity);

      expect(mockStore.dispatch).toHaveBeenCalledWith(actionExpected);
    });
  });
});
