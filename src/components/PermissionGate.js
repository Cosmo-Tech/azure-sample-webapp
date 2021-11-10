// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSelector } from 'react-redux';
import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { PROFILES } from '../config/Permissions';

const hasPermission = ({ permissions, scopes }) => {
  const scopesMap = {};
  scopes.forEach((scope) => {
    scopesMap[scope] = true;
  });
  return permissions.some((permission) => scopesMap[permission]);
};

export function PermissionsGate({ children, RenderErrorComponent = () => <></>, errorProps = null, scopes = [] }) {
  const roles = useSelector((state) => state.auth.roles);
  const permissions = [];
  roles.forEach((role) => {
    const rolePermissions = PROFILES[role];
    if (rolePermissions) {
      rolePermissions.forEach((role) => permissions.push(role));
    }
  });

  const permissionGranted = hasPermission({ permissions, scopes });

  if (!permissionGranted && !errorProps) return <RenderErrorComponent />;

  if (!permissionGranted && errorProps) return cloneElement(children, { ...errorProps });

  return <>{children}</>;
}

PermissionsGate.propTypes = {
  children: PropTypes.object,
  RenderErrorComponent: PropTypes.object,
  errorProps: PropTypes.object,
  scopes: PropTypes.array,
};
