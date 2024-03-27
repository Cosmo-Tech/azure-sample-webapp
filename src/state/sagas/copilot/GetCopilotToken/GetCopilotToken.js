import { put, takeEvery, call } from 'redux-saga/effects';
import { COPILOT_ACTIONS_KEY, COPILOT_STATUS } from '../../../commons/CopilotConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* getCopilotToken(action) {
  try {
    const data = yield call(() =>
      fetch("https://dev.api.cosmotech.com/copilot/token")
        .then((response) => response.json())
        .then((resultJson) => resultJson)
    );
    console.log(`COPILOT DATA: ${data}`);
    yield put({
      type: COPILOT_ACTIONS_KEY.SET_COPILOT_TOKEN,
      status: COPILOT_STATUS.READY,
      token: data.token,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        "An error occurred when trying to get the copilot token. Please try again later."
      )
    );
  }
}
function* getCopilotTokenSaga() {
  yield takeEvery(COPILOT_ACTIONS_KEY.GET_COPILOT_TOKEN, getCopilotToken);
}

export default getCopilotTokenSaga;
