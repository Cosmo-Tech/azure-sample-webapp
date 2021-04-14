// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux'
import CardSimulationParameters from './CardSimulationParameters'

// TODO Add a loading screen between SignIn and Scenario view
// The loading screen should be disabled when all data needed has been fetched from servers
// This way, state will have all data available (replace simulationName and simulatorName default value)
const mapStateToProps = (state) => ({
  scenarioList: state.scenario.scenarioList.list,
  simulationName: 'Brewery Master Analysis',
  simulatorName: 'supplychain'
})

export default connect(mapStateToProps, null)(CardSimulationParameters)
