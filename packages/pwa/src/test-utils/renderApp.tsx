import { render, screen } from '@testing-library/react';
import * as React from 'react';

import Home from '../pages/index';

export const renderApp = () => {
  render(<Home />);

  const roundInput = screen.getByTestId('rounds-input');
  const workIntervalMinuteInput = screen.getByTestId(
    'work-interval-input-minutes'
  );
  const workIntervalSecondInput = screen.getByTestId(
    'work-interval-input-seconds'
  );
  const breakIntervalMinuteInput = screen.getByTestId(
    'break-interval-input-minutes'
  );
  const breakIntervalSecondInput = screen.getByTestId(
    'break-interval-input-seconds'
  );
  const startButton = screen.getByRole('button', { name: /start/i });
  const prepTime = 5;

  return {
    roundInput,
    workIntervalMinuteInput,
    workIntervalSecondInput,
    breakIntervalMinuteInput,
    breakIntervalSecondInput,
    startButton,
    prepTime,
  };
};
