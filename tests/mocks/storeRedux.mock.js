// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createStore } from 'redux';

export const MOCK_STORE_ACTIONS = {
  UPDATE: 'Update Store',
};

function reducer(state = [], action) {
  switch (action.type) {
    case MOCK_STORE_ACTIONS.UPDATE:
      return action.updateData;
    default:
      return state;
  }
}

const reduce = jest.fn();

const createMockStore = (initialState) => {
  const store = createStore(reducer, initialState);

  store.oldDispatch = store.dispatch;
  store.dispatch = reduce;

  store.update = (updateData) => {
    store.oldDispatch({
      type: MOCK_STORE_ACTIONS.UPDATE,
      updateData,
    });
  };

  return store;
};

export { createMockStore };
