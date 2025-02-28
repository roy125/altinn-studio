import type { SagaIterator } from 'redux-saga';
import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { get } from 'app-shared/utils/networking';
import { ConfigurationActions } from '../configurationSlice';
import { envConfigPath } from 'app-shared/api-paths';

// GET ENVIRONMENTS
function* getEnvironmentsSaga(): SagaIterator {
  try {
    const result = yield call(get, envConfigPath());
    yield put(ConfigurationActions.getEnvironmentsFulfilled({ result }));
  } catch (error) {
    yield put(ConfigurationActions.getEnvironmentsRejected({ error }));
  }
}

function* watchGetEnvironmentsSaga(): SagaIterator {
  yield takeLatest(ConfigurationActions.getEnvironments, getEnvironmentsSaga);
}

// WATCHES EXPORT
export default function* getEnvironmentsSagas(): SagaIterator {
  yield fork(watchGetEnvironmentsSaga);
}
