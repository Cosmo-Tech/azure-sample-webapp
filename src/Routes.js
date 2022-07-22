// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Routes as Routes_, Navigate, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TabLayout } from './layouts';
import { SignIn as SignInView, AccessDenied as AccessDeniedView } from './views';

const Routes = (props) => {
  const { authenticated, authorized, tabs } = props;

  return (
    <Routes_>
      {/*
      <Route path={'/'} element={<Navigate to="/scenario" replace />}></Route>
*/}
      <Route path="/sign-in" element={authenticated === false ? <SignInView /> : <Navigate to="/scenario" />} />
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
    </Routes_>
  );
};

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool,
  tabs: PropTypes.any,
};

export default Routes;
