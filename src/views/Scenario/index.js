// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';

import { dispatchGetScenarioList, dispatchGetScenarioTree } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  currentScenario: state.scenario.current,
  scenarioTree: state.scenario.tree
});

// connect Scenario view to state store
// add getScenarioListAction (dispatch) method to props
const mapDispatchToProps = {
  getScenarioListAction: dispatchGetScenarioList,
  getScenarioTreeAction: dispatchGetScenarioTree
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);
