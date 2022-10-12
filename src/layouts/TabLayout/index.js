// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux';
import TabLayout from './TabLayout';
import {
  dispatchClearApplicationErrorMessage,
  dispatchSetApplicationTheme,
} from '../../state/dispatchers/app/ApplicationDispatcher';

const mapStateToProps = (state) => ({
  userId: state.auth.userId,
  userName: state.auth.userName,
  userEmail: state.auth.userEmail,
  userProfilePic: state.auth.profilePic || '',
  authStatus: state.auth.status,
  error: state.application.error,
});

const mapDispatchToProps = {
  clearApplicationErrorMessage: dispatchClearApplicationErrorMessage,
  setApplicationTheme: dispatchSetApplicationTheme,
};
export default connect(mapStateToProps, mapDispatchToProps)(TabLayout);
