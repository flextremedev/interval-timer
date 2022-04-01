import { fireEvent, render, screen } from '@testing-library/react';
import * as nextThemes from 'next-themes';

import { ThemeToggle } from './ThemeToggle';

jest.mock('next-themes');

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    iconName       | mode
    ${'Sun icon'}  | ${'dark'}
    ${'Moon icon'} | ${'light'}
  `('should work for $mode mode', async ({ iconName, mode }) => {
    const setTheme = jest.fn();
    jest
      .spyOn(nextThemes, 'useTheme')
      .mockReturnValue({ theme: mode, setTheme });
    render(<ThemeToggle />);

    expect(
      screen.getByRole('button', { name: 'theme-toggle' })
    ).toBeInTheDocument();

    expect(screen.getByRole('img', { name: iconName })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'theme-toggle' }));
    expect(setTheme).toHaveBeenCalledTimes(1);
    expect(setTheme).toHaveBeenCalledWith(mode === 'dark' ? 'light' : 'dark');
  });
});
