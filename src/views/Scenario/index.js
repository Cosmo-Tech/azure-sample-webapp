// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  currentScenario: state.scenario.current,
  scenarioTree: state.scenario.tree
});

export default connect(mapStateToProps, null)(Scenario);
