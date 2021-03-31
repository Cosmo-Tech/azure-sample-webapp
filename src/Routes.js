// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { PublicRoute, PrivateRoute } from './components'
import { Tab as TabLayout } from './layouts'
import {
  SignIn as SignInView,
  Unauthorized as UnauthorizedView,
  DigitalTwin as DigitalTwinView
} from './views'

const Routes = props => {
  const { authenticated, authorized } = props
  const tabs = [
    {
      key: 'DigitalTwin',
      label: 'Digital Twin',
      to: '/digitaltwin',
      render: () => <DigitalTwinView /> // eslint-disable-line
    }
  ]

  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/digitaltwin"
      />
      <PublicRoute
        exact
        path="/sign-in"
        authenticated={authenticated}
        authorized={authorized}
        component={SignInView}
        redirectTo="/digitaltwin"
        unauthorizedPath="/unauthorized"
      >
      </PublicRoute>
      <PrivateRoute
        exact
        path="/unauthorized"
        authenticated={authenticated}
        authorized={authorized}
        render={() => <UnauthorizedView/>}
        redirectTo="/digitaltwin"
        >
      </PrivateRoute>
      <TabLayout tabs={tabs}
        authenticated={authenticated}
        authorized={authorized}
        signInPath="/sign-in"
        unauthorizedPath="/unauthorized"/>
    </Switch>
  )
}

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool
}

export default Routes
