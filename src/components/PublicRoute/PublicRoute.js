// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const PublicRoute = props => {
  const {
    component: Component, authenticated, authorized,
    redirectTo, unauthorizedPath, ...rest
  } = props

  return (
    <Route
      {...rest}
      render={routeProps =>
        authenticated === false
          ? (<Component {...routeProps} />)
          : (authorized === false
              ? (<Redirect to={props.unauthorizedPath} />)
              : (<Redirect to={props.redirectTo} />)
            )
      }
    />
  )
}

PublicRoute.propTypes = {
  component: PropTypes.any,
  authenticated: PropTypes.bool,
  authorized: PropTypes.bool,
  redirectTo: PropTypes.string,
  unauthorizedPath: PropTypes.string
}

export default PublicRoute
