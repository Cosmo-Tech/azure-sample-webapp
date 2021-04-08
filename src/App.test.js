// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { Suspense } from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from './App'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18next.config'

describe('App test suite', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders App loading', () => {
    act(() => {
      const appScreen = render(
                <Suspense fallback="loading">
                    <I18nextProvider i18n={i18n}>
                        <App />
                    </I18nextProvider>
                </Suspense>)
      appScreen.getByText('loading')
    })
  })
})
