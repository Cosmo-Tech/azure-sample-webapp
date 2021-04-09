// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux'
import Scenario from './Scenario'

import { getScenarioListAction } from '../../redux/actions/scenario/ScenarioActions'

// connect Scenario view to redux store
// add getScenarioListAction (dispatch) method to props
const mapDispatchToProps = {
  getScenarioListAction
}

export default connect(null, mapDispatchToProps)(Scenario)
