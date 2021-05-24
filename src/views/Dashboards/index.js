// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Dashboards from './Dashboards';

const mapStateToProps = (state) => ({
  scenarioName: state.scenario.current.data.name
});

export default connect(mapStateToProps)(Dashboards);
