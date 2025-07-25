// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import { dispatchLogIn } from '../../state/auth/dispatchers';
import SignIn from './SignIn';

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  logInAction: dispatchLogIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
