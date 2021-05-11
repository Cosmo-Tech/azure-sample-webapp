// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';
import { dispatchFindScenarioById, dispatchCreateScenario } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  datasetList: state.dataset.list,
  runTemplateList: state.runTemplate.list,
  currentScenario: state.scenario.current,
  scenarioTree: state.scenario.tree,
  user: state.auth,
  workspace: state.workspace.current,
  solution: state.solution.current
});

const mapDispatchToProps = {
  findScenarioById: dispatchFindScenarioById,
  createScenario: dispatchCreateScenario
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);
