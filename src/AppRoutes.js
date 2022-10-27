// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes, Navigate, Route, useLocation, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabLayout } from './layouts';
import { SignIn as SignInView, AccessDenied as AccessDeniedView } from './views';
import Workspaces from './views/Workspaces';
import { useWorkspace } from './state/hooks/WorkspaceHooks';

const AppRoutes = (props) => {
  const { authenticated, authorized, tabs } = props;
  const location = useLocation();
  const previousUrl = sessionStorage.getItem('previousURL');
  // TODO: the following constant gives access to workspaceId (sharedUrl?.params?.workspaceId) in url and can be
  //  used to set currentWorkspace if user has a link to specific scenario
  // const sharedUrl = matchPath(':workspaceId/:view/*', previousUrl);
  const currentWorkspace = useWorkspace();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={previousUrl || '/workspaces'} replace />} />
      <Route
        path="/workspaces"
        element={
          !authenticated ? (
            <Navigate to={'/sign-in'} state={{ from: location.pathname }} />
          ) : !authorized ? (
            <Navigate to={'/accessDenied'} />
          ) : currentWorkspace ? (
            <Navigate to={`/${currentWorkspace.data.id}/scenario`} />
          ) : (
            <Workspaces />
          )
        }
      />
      <Route path=":workspaceId" element={<Navigate to="scenario" />} />
      <Route
        path=":workspaceId"
        element={
          <TabLayout
            tabs={tabs}
            authenticated={authenticated}
            authorized={authorized}
            signInPath="/sign-in"
            unauthorizedPath="/accessDenied"
          />
        }
      >
        {tabs.map((tab) => (
          <Route
            key={tab.key}
            path={tab.to}
            element={
              !authenticated ? (
                <Navigate to={'/sign-in'} state={{ from: location.pathname }} />
              ) : !authorized ? (
                <Navigate to={'/accessDenied'} />
              ) : (
                tab.render
              )
            }
          >
            {(tab.to === 'scenario' || 'instance') && (
              <Route
                path=":scenarioId"
                element={
                  !authenticated ? (
                    <Navigate to={'/sign-in'} state={{ from: location.pathname }} />
                  ) : !authorized ? (
                    <Navigate to={'/accessDenied'} />
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
        element={!authenticated ? <SignInView /> : <Navigate to={history?.state?.idx === 0 ? '/workspaces' : -1} />}
      />
      <Route path="/accessDenied" element={<AccessDeniedView />} />
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
