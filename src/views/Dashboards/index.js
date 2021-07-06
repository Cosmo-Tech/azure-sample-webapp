// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Dashboards from './Dashboards';

const mapStateToProps = (state) => ({
  currentScenario: state.scenario.current.data,
  scenarioList: state.scenario.list,
  reports: state.powerBI
});

export default connect(mapStateToProps)(Dashboards);
