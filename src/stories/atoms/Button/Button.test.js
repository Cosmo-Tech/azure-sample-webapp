/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  it('renders the label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary state', () => {
    const { container } = render(<Button primary label="Primary" />);
    expect(container.firstChild).toHaveClass('primary');
  });

  it('calls onClick handler', () => {
    const fn = jest.fn();
    render(<Button label="Click" onClick={fn} />);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalled();
  });
});
