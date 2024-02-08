// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { cloneElement } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// DEPRECATED ! The component PermissionsGate is deprecated and will be removed in a future update. Please consider
// using the component PermissionsGate from the @cosmotech/ui package instead

let hasDeprecatedWarningBeenShown = false;

const hasPermission = (userPermissions, requiredPermissions) => {
  const filteredPermissions = userPermissions.filter((permission) => requiredPermissions.includes(permission));
  return filteredPermissions.length > 0;
};

function hasSufficientRoles(userRoles, requiredRoles) {
  return requiredRoles.some((profile) => userRoles.includes(profile));
}

export const PermissionsGate = ({
  children,
  RenderNoPermissionComponent,
  noPermissionProps,
  authorizedPermissions,
  authorizedRoles,
}) => {
  if (!hasDeprecatedWarningBeenShown) {
    console.warn(
      'The component PermissionsGate is deprecated and will be removed in a future update. Please consider using ' +
        'the component PermissionsGate from the @cosmotech/ui package instead.'
    );
    hasDeprecatedWarningBeenShown = true;
  }
  const userRoles = useSelector((state) => state.auth.roles);
  const userPermissions = useSelector((state) => state.auth.permissions);

  const noRequiredPermissions = Array.isArray(authorizedPermissions) && authorizedPermissions.length === 0;
  const noRequiredRoles = Array.isArray(authorizedRoles) && authorizedRoles.length === 0;

  const permissionGranted = hasPermission(userPermissions, authorizedPermissions) || noRequiredPermissions;
  const roleGranted = hasSufficientRoles(userRoles, authorizedRoles) || noRequiredRoles;

  if (!(permissionGranted && roleGranted) && !noPermissionProps) return <RenderNoPermissionComponent />;

  if (!(permissionGranted && roleGranted) && noPermissionProps) return cloneElement(children, { ...noPermissionProps });

  return <>{children}</>;
};

PermissionsGate.propTypes = {
  /**
   * Component children
   */
  children: PropTypes.node,
  /**
   * Component to render if permissions/roles are not sufficient
   */
  RenderNoPermissionComponent: PropTypes.func,
  /**
   * Props spread to children component if permissions/roles are not sufficient
   */
  noPermissionProps: PropTypes.object,
  /**
   * Required permissions to render children component:
   * If connected user has one of the required permissions, children component will be displayed
   */
  authorizedPermissions: PropTypes.array,
  /**
   * Required roles to render children component
   * If connected user has one of the required roles, children component will be displayed
   */
  authorizedRoles: PropTypes.array,
};

PermissionsGate.defaultProps = {
  RenderNoPermissionComponent: () => <></>,
  noPermissionProps: null,
  authorizedPermissions: [],
  authorizedRoles: [],
};
