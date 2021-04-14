import { all, fork } from 'redux-saga/effects'
import { findAllScenariosData } from './FindAllScenarios'

export default function * scenarioSaga () {
  yield all([
    fork(findAllScenariosData)
  ])
}
