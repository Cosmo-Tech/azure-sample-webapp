// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux'
import Scenario from './Scenario'

import { dispatchGetScenarioList } from '../../state/dispatchers/scenario/ScenarioDispatcher'

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list.data,
  currentScenario: state.scenario.current.data
})

// connect Scenario view to state store
// add getScenarioListAction (dispatch) method to props
const mapDispatchToProps = {
  getScenarioListAction: dispatchGetScenarioList
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
