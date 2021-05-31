// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findAllScenariosData } from './FindAllScenarios';
import { getScenariosTreeData } from './GetScenariosTree';
import { findScenarioByIdData } from './FindScenarioById';
import { pollScenarioStateSaga } from './PollScenarioState';
import { createScenarioData } from './CreateScenario';
import { updateAndLaunchScenarioSaga } from './UpdateAndLaunchScenario';

export default function * scenarioSaga () {
  yield all([
    fork(findAllScenariosData),
    fork(getScenariosTreeData),
    fork(findScenarioByIdData),
    fork(createScenarioData),
    fork(pollScenarioStateSaga),
    fork(updateAndLaunchScenarioSaga)
  ]);
}
