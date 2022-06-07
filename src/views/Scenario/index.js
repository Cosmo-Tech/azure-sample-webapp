// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { connect } from 'react-redux';
import Scenario from './Scenario';
import {
  dispatchFindScenarioById,
  dispatchCreateScenario,
  dispatchUpdateAndLaunchScenario,
  dispatchLaunchScenario,
  dispatchSetScenarioValidationStatus,
  dispatchSetCurrentScenario,
} from '../../state/dispatchers/scenario/ScenarioDispatcher';
import { dispatchAddDatasetToStore } from '../../state/dispatchers/dataset/DatasetDispatcher';
import { dispatchSetApplicationErrorMessage } from '../../state/dispatchers/app/ApplicationDispatcher';

const mapStateToProps = (state) => ({
  scenarioList: state.scenario.list,
  datasetList: state.dataset.list,
  currentScenario: state.scenario.current,
  user: state.auth,
  workspace: state.workspace.current,
  solution: state.solution.current,
  reports: state.powerBI,
});

const mapDispatchToProps = {
  addDatasetToStore: dispatchAddDatasetToStore,
  setScenarioValidationStatus: dispatchSetScenarioValidationStatus,
  findScenarioById: dispatchFindScenarioById,
  createScenario: dispatchCreateScenario,
  updateAndLaunchScenario: dispatchUpdateAndLaunchScenario,
  launchScenario: dispatchLaunchScenario,
  setCurrentScenario: dispatchSetCurrentScenario,
  setApplicationErrorMessage: dispatchSetApplicationErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenario);
