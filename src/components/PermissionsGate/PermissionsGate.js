// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { PROFILES } from '../../config/Profiles';
import { useSelector } from 'react-redux';

const hasPermission = ({ permissions, requiredPermissions }) => {
  const filteredPermissions = permissions.filter((permission) => requiredPermissions.includes(permission));
  return filteredPermissions.length > 0;
};

export const PermissionsGate = ({ children, RenderNoPermissionComponent, noPermissionProps, requiredPermissions }) => {
  const roles = useSelector((state) => state.auth.roles);

  const permissions = [];
  roles.forEach((role) => {
    const rolePermissions = PROFILES[role];
    if (rolePermissions) {
      rolePermissions.forEach((role) => permissions.push(role));
    }
  });

  const permissionGranted = hasPermission({ permissions, requiredPermissions });

  if (!permissionGranted && !noPermissionProps) return <RenderNoPermissionComponent />;

  if (!permissionGranted && noPermissionProps) return cloneElement(children, { ...noPermissionProps });

  return <>{children}</>;
};

PermissionsGate.propTypes = {
  /**
   * Component children
   */
  children: PropTypes.object,
  /**
   * Component to render if permissions are not sufficient
   */
  RenderNoPermissionComponent: PropTypes.func,
  /**
   * Props spread to children component if permissions are not sufficient
   */
  noPermissionProps: PropTypes.object,
  /**
   * Required permissions to render children component
   */
  requiredPermissions: PropTypes.array,
};

PermissionsGate.defaultProps = {
  RenderNoPermissionComponent: () => <></>,
  noPermissionProps: null,
  requiredPermissions: [],
};
