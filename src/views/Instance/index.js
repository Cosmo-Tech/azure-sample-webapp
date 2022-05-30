// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Instance from './Instance';
import { dispatchFindScenarioById } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  currentScenario: state.scenario.current,
  workspace: state.workspace.current,
});

const mapDispatchToProps = {
  findScenarioById: dispatchFindScenarioById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Instance);
