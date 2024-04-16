import { put, takeEvery, call } from 'redux-saga/effects';
import ConfigService from '../../../../services/ConfigService';
import { COPILOT_ACTIONS_KEY, COPILOT_STATUS } from '../../../commons/CopilotConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* getCopilotToken() {
  try {
    // Remove trailing slash characters in default base path to prevent CORS errors
    const defaultBasePath = ConfigService.getParameterValue('DEFAULT_BASE_PATH').replace(/\/+$/, '');
    const serviceUrl = `${defaultBasePath}/copilot/token`;

    const data = yield call(() =>
      fetch(serviceUrl)
        .then((response) => response.json())
        .then((resultJson) => resultJson)
    );
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
        'An error occurred when trying to get the copilot token. Please try again later.'
      )
    );
  }
}
function* getCopilotTokenSaga() {
  yield takeEvery(COPILOT_ACTIONS_KEY.GET_COPILOT_TOKEN, getCopilotToken);
}

export default getCopilotTokenSaga;
