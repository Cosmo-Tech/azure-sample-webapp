// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux';
import TabLayout from './TabLayout';

const mapStateToProps = (state) => ({
  userId: state.auth.userId,
  userName: state.auth.userName,
  userProfilePic: state.auth.profilePic || '',
  authStatus: state.auth.status
});

export default connect(mapStateToProps)(TabLayout);
