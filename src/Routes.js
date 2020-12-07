import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { PublicRoute, PrivateRoute } from './components'
import { Tab as TabLayout } from './layouts'
import {
  SignIn as SignInView,
  Unauthorized as UnauthorizedView,
  DigitalTwin as DigitalTwinView,
  ScoreCard as ScoreCardView,
  ScenarioManager as ScenarioManagerView,
  Dashboards as DashboardsView,
  DataModel as DataModelView
} from './views'

const Routes = props => {
  const { authenticated, authorized } = props
  const tabs = [
    {
      key: 'DigitalTwin',
      label: 'Digital Twin',
      to: '/digitaltwin',
      render: () => <DigitalTwinView /> // eslint-disable-line
    },
    {
      key: 'ScoreCard',
      label: 'Score Card',
      to: '/scorecard',
      render: () => <ScoreCardView /> // eslint-disable-line
    },
    {
      key: 'ScenarioManager',
      label: 'Scenario Manager',
      to: '/scenariomanager',
      render: () => <ScenarioManagerView /> // eslint-disable-line
    },
    {
      key: 'Dashboards',
      label: 'Dashboards',
      to: '/dashboards',
      render: () => <DashboardsView /> // eslint-disable-line
    },
    {
      key: 'DataModel',
      label: 'Data Model',
      to: '/datamodel',
      render: () => <DataModelView /> // eslint-disable-line
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
      <Route render={() => <UnauthorizedView/>} />
    </Switch>
  )
}

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool
}

export default Routes
