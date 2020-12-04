import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = props => {
  const { component: Component, authenticated, authorized,
    redirectTo, unauthorizedPath, ...rest } = props;

  return (
    <Route
      {...rest}
      render={routeProps =>
        authenticated === false
          ? ( <Component {...routeProps} /> )
          : (authorized === false
            ? ( <Redirect to={props.unauthorizedPath} /> )
            : ( <Redirect to={props.redirectTo} /> )
          )
      }
    />
  );
}

export default PublicRoute;
