// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';
import { composeWithDevTools } from 'redux-devtools-extension';

const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);
const applicationStore = createStore(rootReducer, composeWithDevTools(middleware));
sagaMiddleware.run(rootSaga);

export default applicationStore;
