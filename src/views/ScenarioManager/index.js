// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { connect } from 'react-redux';
import ScenarioManager from './ScenarioManager';
import {
  dispatchDeleteScenario,
  dispatchFindScenarioById,
  dispatchRenameScenario,
  dispatchResetCurrentScenario,
  dispatchSetCurrentScenario,
} from '../../state/dispatchers/scenario/ScenarioDispatcher';

const mapStateToProps = (state) => ({
  datasets: state.dataset.list.data,
  scenarios: state.scenario.list.data,
  currentScenario: state.scenario.current.data,
  userId: state.auth.userId,
});

const mapDispatchToProps = {
  deleteScenario: dispatchDeleteScenario,
  findScenarioById: dispatchFindScenarioById,
  resetCurrentScenario: dispatchResetCurrentScenario,
  renameScenario: dispatchRenameScenario,
  setCurrentScenario: dispatchSetCurrentScenario,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioManager);
