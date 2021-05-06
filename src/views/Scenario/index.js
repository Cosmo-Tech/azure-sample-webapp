// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';
import { dispatchFindScenarioById, dispatchAddNewScenario } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  datasetList: state.dataset.list,
  runTemplateList: state.runTemplate.list,
  currentScenario: state.scenario.current,
  scenarioTree: state.scenario.tree
});

const mapDispatchToProps = {
  findScenarioById: dispatchFindScenarioById,
  addNewScenario: dispatchAddNewScenario
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);
