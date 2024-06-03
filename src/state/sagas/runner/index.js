import { all, fork } from 'redux-saga/effects';
import applyRunnerSharingChangesSaga from './ApplyRunnerSharingChanges/ApplyRunnerSharingChanges';
import { createRunnerSaga } from './CreateRunner';
import { createSimulationRunnerSaga } from './CreateSimulationRunner';
import deleteRunnerSaga from './DeleteRunner/DeleteRunner';
import { getAllSimulationRunnersSaga } from './GetAllSimulationRunners';
import { getRunnerSaga } from './GetRunner';
import { pollRunnerStateSaga } from './PollRunnerState';
import { renameRunnerSaga } from './RenameRunner';
import { startRunnerSaga } from './StartRunner';
import { stopRunnerSaga } from './StopRunner';
import { stopSimulationRunnerSaga } from './StopSimulationRunner';
import { updateAndStartRunnerSaga } from './UpdateAndStartRunner';
import { updateRunnerSaga } from './UpdateRunner';

export default function* runnerSaga() {
  yield all([
    fork(createRunnerSaga),
    fork(createSimulationRunnerSaga),
    fork(getAllSimulationRunnersSaga),
    fork(getRunnerSaga),
    fork(updateRunnerSaga),
    fork(updateAndStartRunnerSaga),
    fork(startRunnerSaga),
    fork(pollRunnerStateSaga),
    fork(stopRunnerSaga),
    fork(renameRunnerSaga),
    fork(applyRunnerSharingChangesSaga),
    fork(deleteRunnerSaga),
    fork(stopSimulationRunnerSaga),
  ]);
}
