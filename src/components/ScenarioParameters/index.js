// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux';
import ScenarioParameters from './ScenarioParameters';

const mapStateToProps = (state) => ({
  isDarkTheme: state.application.isDarkTheme,
});

export default connect(mapStateToProps)(ScenarioParameters);
