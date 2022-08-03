// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes, Navigate, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabLayout } from './layouts';
import { SignIn as SignInView, AccessDenied as AccessDeniedView } from './views';

const AppRoutes = (props) => {
  const { authenticated, authorized, tabs } = props;
  const previousUrl = sessionStorage.getItem('previousURL');
  const location = useLocation();
  return (
    <Routes>
      <Route index element={<Navigate to={previousUrl || '/scenario'} replace />}></Route>
      <Route
        path="/sign-in"
        element={!authenticated ? <SignInView /> : <Navigate to={history.state.idx === 0 ? '/scenario' : -1} />}
      />
      <Route path="/accessDenied" element={<AccessDeniedView />} />
      <Route
        path="/"
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
            {tab.to === '/scenario' && (
              <Route
                path="/scenario/:id"
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
      <Route path="*" element={<Navigate to={'/scenario'} />} />
    </Routes>
  );
};

AppRoutes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool,
  tabs: PropTypes.any,
};

export default AppRoutes;
