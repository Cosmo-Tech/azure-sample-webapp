// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { applyScenarioSharingChangesSaga } from './ApplyScenarioSharingChanges';
import { createScenarioData } from './CreateScenario';
import { deleteScenarioSaga } from './DeleteScenario';
import { findAllScenariosData } from './FindAllScenarios';
import { findScenarioByIdData } from './FindScenarioById';
import { launchScenarioSaga } from './LaunchScenario';
import { pollScenarioStateSaga } from './PollScenarioState';
import { renameScenarioSaga } from './RenameScenario';
import { saveAndLaunchScenarioSaga } from './SaveAndLaunchScenario';
import { saveScenarioSaga } from './SaveScenario';

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
