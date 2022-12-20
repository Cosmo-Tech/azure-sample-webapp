// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes, Navigate, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabLayout } from './layouts';
import { SignIn as SignInView, AccessDenied as AccessDeniedView } from './views';
import Workspaces from './views/Workspaces';
import { useWorkspaceId } from './state/hooks/WorkspaceHooks';

const AppRoutes = (props) => {
  const { authenticated, authorized, tabs } = props;
  const location = useLocation();
  const providedUrl = sessionStorage.getItem('providedUrl');
  const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
  const currentWorkspaceId = useWorkspaceId();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={providedUrlBeforeSignIn || providedUrl || '/workspaces'} replace />} />
      <Route
        path="/workspaces"
        element={
          !authenticated ? (
            <Navigate to="/sign-in" state={{ from: location.pathname }} />
          ) : !authorized ? (
            <Navigate to="/accessDenied" replace />
          ) : currentWorkspaceId ? (
            <Navigate to={`/${currentWorkspaceId}/scenario`} />
          ) : (
            <Workspaces />
          )
        }
      />
      <Route path=":workspaceId" element={!authenticated ? <Navigate to="/sign-in" /> : <Navigate to="scenario" />} />
      <Route
        path=":workspaceId"
        element={
          !authenticated ? (
            <Navigate to="/sign-in" state={{ from: location.pathname }} />
          ) : !authorized ? (
            <Navigate to="/accessDenied" replace />
          ) : (
            <TabLayout tabs={tabs} />
          )
        }
      >
        {tabs.map((tab) => (
          <Route
            key={tab.key}
            path={tab.to}
            element={
              !authenticated ? (
                <Navigate to="/sign-in" state={{ from: location.pathname }} />
              ) : !authorized ? (
                <Navigate to="/accessDenied" replace />
              ) : (
                tab.render
              )
            }
          >
            {['scenario', 'instance'].includes(tab.to) && (
              <Route
                path=":scenarioId"
                element={
                  !authenticated ? (
                    <Navigate to="/sign-in" state={{ from: location.pathname }} />
                  ) : !authorized ? (
                    <Navigate to="/accessDenied" replace />
                  ) : (
                    tab.render
                  )
                }
              />
            )}
          </Route>
        ))}
      </Route>
      <Route
        path="/sign-in"
        element={
          !authenticated ? <SignInView /> : <Navigate to={providedUrlBeforeSignIn || providedUrl || '/workspaces'} />
        }
      />
      <Route
        path="/accessDenied"
        element={!authenticated ? <SignInView /> : authorized ? <Navigate to="/workspaces" /> : <AccessDeniedView />}
      />
      <Route path="*" element={<Navigate to={'/workspaces'} />} />
    </Routes>
  );
};

AppRoutes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool,
  tabs: PropTypes.any,
};

export default AppRoutes;
