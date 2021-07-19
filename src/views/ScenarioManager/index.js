// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import ScenarioManager from './ScenarioManager';

const mapStateToProps = (state) => ({
  datasets: state.dataset.list.data,
  scenarios: state.scenario.list.data,
  currentScenario: state.scenario.current.data
});

export default connect(mapStateToProps)(ScenarioManager);
