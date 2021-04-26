// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Dashboards from './Dashboards';

const mapStateToProps = (state) => ({
  scenarioId: state.scenario.current.data.id
});

export default connect(mapStateToProps)(Dashboards);
