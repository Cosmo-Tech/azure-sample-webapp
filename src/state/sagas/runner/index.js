import { all, fork } from 'redux-saga/effects';
import { createRunnerSaga } from './CreateRunner';
import { getAllRunnersSaga } from './GetAllRunners';
import { stopRunnerSaga } from './StopRunner';

export default function* runnerSaga() {
  yield all([fork(createRunnerSaga), fork(stopRunnerSaga), fork(getAllRunnersSaga)]);
}
