import { all, fork } from 'redux-saga/effects'

import getScenarioListData from './GetScenarioListData'

export default function * scenarioSaga () {
  yield all([
    fork(getScenarioListData)
  ])
}
