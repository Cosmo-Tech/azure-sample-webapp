// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AUTH_STATUS } from '../../state/commons/AuthConstants';
import { STATUSES } from '../../state/commons/Constants';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { AccessDenied, SignIn } from '../../views';
import Workspaces from '../../views/Workspaces';
import { useUserStatusGateHook } from './UserStatusGateHook';

export const UserStatusGate = ({ children }) => {
  const { authStatus, applicationStatus } = useUserStatusGateHook();
  const currentSolution = useSolution();

  const authenticated = authStatus === AUTH_STATUS.AUTHENTICATED || authStatus === AUTH_STATUS.DISCONNECTING;
  const authorized = applicationStatus === STATUSES.SUCCESS;
  const solutionUnauthorized = currentSolution.status === STATUSES.ERROR;
  const location = useLocation();
  const pathname = location.pathname;

  if (!authenticated)
    return pathname === '/sign-in' ? <SignIn /> : <Navigate to="/sign-in" state={{ from: pathname }} />;
  if (!authorized) return pathname === '/accessDenied' ? <AccessDenied /> : <Navigate to="/accessDenied" replace />;
  if (solutionUnauthorized) return pathname === '/workspaces' ? <Workspaces /> : <Navigate to="/workspaces" replace />;

  return children;
};
UserStatusGate.propTypes = {
  /**
   * Component children
   */
  children: PropTypes.node,
};
