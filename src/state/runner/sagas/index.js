import { all, fork } from 'redux-saga/effects';
import applyRunnerSharingChangesSaga from './ApplyRunnerSharingChanges';
import createRunnerSaga from './CreateETLRunnerAndDataset';
import createSimulationRunnerSaga from './CreateSimulationRunner';
import deleteRunnerSaga from './DeleteRunner';
import getAllSimulationRunnersSaga from './GetAllRunners';
import getRunnerSaga from './GetRunner';
import pollRunnerStateSaga from './PollRunnerState';
import renameRunnerSaga from './RenameRunner';
import startEtlRunnerSaga from './StartEtlRunner';
import startRunnerSaga from './StartRunner';
import stopRunnerSaga from './StopRunner';
import stopSimulationRunnerSaga from './StopSimulationRunner';
import updateAndStartRunnerSaga from './UpdateAndStartRunner';
import updateEtlRunnerSaga from './UpdateEtlRunner';
import updateSimulationRunnerSaga from './UpdateSimulationRunner';

export default function* runnerSaga() {
  yield all([
    fork(createRunnerSaga),
    fork(createSimulationRunnerSaga),
    fork(getAllSimulationRunnersSaga),
    fork(getRunnerSaga),
    fork(updateSimulationRunnerSaga),
    fork(updateAndStartRunnerSaga),
    fork(startEtlRunnerSaga),
    fork(startRunnerSaga),
    fork(pollRunnerStateSaga),
    fork(stopRunnerSaga),
    fork(renameRunnerSaga),
    fork(applyRunnerSharingChangesSaga),
    fork(deleteRunnerSaga),
    fork(stopSimulationRunnerSaga),
    fork(updateEtlRunnerSaga),
  ]);
}
