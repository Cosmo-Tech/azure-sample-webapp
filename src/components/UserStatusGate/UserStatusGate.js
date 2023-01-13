// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { AUTH_STATUS } from '../../state/commons/AuthConstants';
import { STATUSES } from '../../state/commons/Constants';
import { useUserStatusGateHook } from './UserStatusGateHook';
import { Navigate, useLocation } from 'react-router-dom';
import { AccessDenied, SignIn } from '../../views';

export const UserStatusGate = ({ children }) => {
  const { authStatus, applicationStatus } = useUserStatusGateHook();
  const authenticated = authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING;
  const authorized = applicationStatus === STATUSES.SUCCESS;
  const location = useLocation();

  return !authenticated ? (
    location.pathname === '/sign-in' ? (
      <SignIn />
    ) : (
      <Navigate to="/sign-in" state={{ from: location.pathname }} />
    )
  ) : !authorized ? (
    location.pathname === '/accessDenied' ? (
      <AccessDenied />
    ) : (
      <Navigate to="/accessDenied" replace />
    )
  ) : (
    children
  );
};
UserStatusGate.propTypes = {
  /**
   * Component children
   */
  children: PropTypes.node,
};
