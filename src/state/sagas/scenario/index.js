// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findAllScenariosData } from './FindAllScenarios';
import { findScenarioByIdData } from './FindScenarioById';
import { pollScenarioStateSaga } from './PollScenarioState';
import { createScenarioData } from './CreateScenario';
import { deleteScenarioSaga } from './DeleteScenario';
import { renameScenarioSaga } from './RenameScenario';
import { applyScenarioSharingChangesSaga } from './ApplyScenarioSharingChanges';
import { saveScenarioSaga } from './SaveScenario';
import { saveAndLaunchScenarioSaga } from './SaveAndLaunchScenario';
import { launchScenarioSaga } from './LaunchScenario';

export default function* scenarioSaga() {
  yield all([
    fork(findAllScenariosData),
    fork(findScenarioByIdData),
    fork(createScenarioData),
    fork(deleteScenarioSaga),
    fork(renameScenarioSaga),
    fork(applyScenarioSharingChangesSaga),
    fork(pollScenarioStateSaga),
    fork(saveAndLaunchScenarioSaga),
    fork(saveScenarioSaga),
    fork(launchScenarioSaga),
  ]);
}
