import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './Routes';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import './assets/scss/index.scss';
import auth from './helpers/auth.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      title: 'csm web-app',
      authenticated: false,
      authorized: false,
      loading: true
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    document.title = this.state.title;
    // Check if the user is already signed-in
    const authenticated = await auth.isUserSignedIn();
    if(authenticated) {
      this.setState({
        authenticated: authenticated,
        authorized: authenticated, // TODO: handle authorization
      });
    }
    // Bind callback to update state on authentication data change
    auth.onAuthStateChanged(authData => {
      if(authData && this._isMounted) {
        this.setState({
          authenticated: authData.authenticated,
          authorized: authData.authenticated, // TODO: handle authorization
        });
      }
    });

    this.setState({
      loading: false
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return this.state.loading === true ? (
      <ThemeProvider theme={theme}>
        <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </ThemeProvider>
    ) : (
      <ThemeProvider theme={theme}>
        <Router>
          <Routes authenticated={this.state.authenticated}
            authorized={this.state.authenticated} />
          {/* <Routes authenticated={this.state.authenticated}
            authorized={this.state.authorized} /> */}
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
