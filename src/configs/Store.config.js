// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const applicationStore = createStore(rootReducer, composeWithDevTools()
)

export default applicationStore
