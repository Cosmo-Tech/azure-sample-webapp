// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './configs/i18next.config'
import applicationStore from './redux/Store.config'

ReactDOM.render(
    <Suspense fallback="loading">
      <React.StrictMode>
          <Provider store={applicationStore}>
            <App />
          </Provider>
      </React.StrictMode>
    </Suspense>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
