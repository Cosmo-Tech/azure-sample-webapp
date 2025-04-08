// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();
const applicationStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    // redux/toolkit throws console errors if it meets some non-serializable data,
    // like dates, in actions or in state. As this data comes from integration config
    // that we cannot control, we can disable these checks for now and enable it later
    // when we will find a solution to patch the data before or give some instructions
    // in integration guide
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreState: true,
        ignoreActions: true,
      },
    }).concat(sagaMiddleware);
  },
});
sagaMiddleware.run(rootSaga);

export default applicationStore;
