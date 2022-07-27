// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabLayout } from './layouts';
import { SignIn as SignInView, AccessDenied as AccessDeniedView } from './views';

const AppRoutes = (props) => {
  const { authenticated, authorized, tabs } = props;
  const previousUrl = sessionStorage.getItem('previousURL');
  return (
    <Routes>
      <Route path={'/'} element={<Navigate to={previousUrl || '/scenario'} replace />}></Route>
      <Route
        path="/sign-in"
        element={!authenticated ? <SignInView /> : <Navigate to={history.state.idx === 0 ? '/scenario' : -1} />}
      />
      <Route path="/accessDenied" element={<AccessDeniedView />} />
      <Route
        path="/*"
        element={
          <TabLayout
            tabs={tabs}
            authenticated={authenticated}
            authorized={authorized}
            signInPath="/sign-in"
            unauthorizedPath="/accessDenied"
          />
        }
      />
    </Routes>
  );
};

AppRoutes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool,
  tabs: PropTypes.any,
};

export default AppRoutes;
