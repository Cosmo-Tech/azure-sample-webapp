// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux';
import { dispatchLogIn } from '../../state/dispatchers/auth/AuthDispatcher';
import SignIn from './SignIn';

const mapDispatchToProps = {
  logInAction: dispatchLogIn
};

export default connect(null, mapDispatchToProps)(SignIn);
