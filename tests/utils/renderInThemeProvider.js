import { render } from '@testing-library/react';
import React from 'react';
import MockTheme from '../mocks/MockThemeProvider';

export const renderInMuiThemeProvider = (children) => {
  return render(<MockTheme>{children}</MockTheme>);
};
