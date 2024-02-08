// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import AccessDenied from './AccessDenied';

const mapStateToProps = (state) => ({
  application: state.application,
});

export default connect(mapStateToProps)(AccessDenied);
