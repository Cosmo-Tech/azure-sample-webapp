import { all, fork } from 'redux-saga/effects';
import { createRunnerSaga } from './CreateRunner';

export default function* runnerSaga() {
  yield all([fork(createRunnerSaga)]);
}
