import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = props => {
  const {render, authenticated, authorized, noAuthRedirect,
    noPermRedirect, ...rest } = props;

  let route = (
      <Route
        {...rest}
       render={render} />)

  if (!authenticated) {
    route = (
      <Route
        {...rest}
        render={routeProps =>
          <Redirect to={{
            pathname: props.noAuthRedirect,
            state: { from: routeProps.location } }}
          />
        }
      />
    )
  }
  else if (!authorized && noPermRedirect !== undefined) {
    route = (
      <Route
        {...rest}
        render={routeProps =>
          <Redirect to={{
            pathname: props.noPermRedirect,
            state: { from: routeProps.location } }}
          />
        }
      />
    )
  }

  return route;
}

export default PrivateRoute;
