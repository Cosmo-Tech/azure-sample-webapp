import React from 'react';
import { render } from '@testing-library/react';
import MockTheme from '../mocks/MockThemeProvider';

export const renderInMuiThemeProvider = (children) => {
  return render(<MockTheme>{children}</MockTheme>);
};
