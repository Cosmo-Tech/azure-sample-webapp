// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';
import {
  dispatchFindScenarioById,
  dispatchCreateScenario,
  dispatchUpdateAndLaunchScenario,
  dispatchLaunchScenario
} from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  datasetList: state.dataset.list,
  runTemplateList: state.runTemplate.list,
  currentScenario: state.scenario.current,
  user: state.auth,
  workspace: state.workspace.current,
  solution: state.solution.current,
  reports: state.powerBI
});

const mapDispatchToProps = {
  findScenarioById: dispatchFindScenarioById,
  createScenario: dispatchCreateScenario,
  updateAndLaunchScenario: dispatchUpdateAndLaunchScenario,
  launchScenario: dispatchLaunchScenario
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);
