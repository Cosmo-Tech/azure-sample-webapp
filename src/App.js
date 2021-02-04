import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import Routes from './Routes'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import './assets/scss/index.scss'
import './service/auth.js'
import { Auth } from '@cosmotech/core'

class App extends Component {
  constructor () {
    super()
    this.state = {
      title: 'Cosmo Tech Web Application Sample',
      authenticated: false,
      authorized: false,
      loading: true
    }
    this._isMounted = false
    this.authenticationDone = this.authenticationDone.bind(this)
    this.debugLocalKey = this.debugLocalKey.bind(this)
    this.debugToken = this.debugToken.bind(this)
  }

  async componentDidMount () {
    this._isMounted = true
    const appInsights = new ApplicationInsights({
      name: 'Web Application Sample',
      config: {
        instrumentationKey: '05ef985d-8209-46db-acb0-d035da80faa1',
        disableFetchTracking: false,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableAutoRouteTracking: true,
        distributedTracingMode: 'DistributedTracingModes.W3C'
      }
    })
    appInsights.loadAppInsights()
    appInsights.trackPageView()
    document.title = this.state.title
    // Check if the user is already signed-in
    if (Auth.isAsync()) {
      Auth.isUserSignedIn(this.authenticationDone)
    } else {
      const authenticated = await Auth.isUserSignedIn()
      this.authenticationDone(authenticated)
    }
  }

  debugLocalKey (key) {
    const value = localStorage.getItem(key)
    if (value) {
      console.log(key + ': ' + value)
    } else {
      console.log(key + ': ' + 'NO VALUE')
    }
  }

  debugToken () {
    this.debugLocalKey('authIdTokenPopup')
    this.debugLocalKey('authIdToken')
    this.debugLocalKey('authAccessToken')
  }

  authenticationDone (authenticated) {
    this.debugToken()
    if (authenticated) {
      this.setState({
        authenticated: authenticated,
        authorized: authenticated // TODO: handle authorization
      })
    }
    // Bind callback to update state on authentication data change
    Auth.onAuthStateChanged(authData => {
      if (authData && this._isMounted) {
        this.setState({
          authenticated: authData.authenticated,
          authorized: authData.authenticated // TODO: handle authorization
        })
      }
    })

    this.setState({
      loading: false
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    return this.state.loading === true
      ? (
      <ThemeProvider theme={theme}>
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </ThemeProvider>
        )
      : (
      <ThemeProvider theme={theme}>
        <Router>
          <Routes authenticated={this.state.authenticated}
            authorized={this.state.authenticated} />
          {/* <Routes authenticated={this.state.authenticated}
            authorized={this.state.authorized} /> */}
        </Router>
      </ThemeProvider>
        )
  }
}

export default App
