import * as React from 'react';

import { DurationInput } from '../DurationInput/DurationInput';

type CounterProps = {
  timeLeft: Date;
  roundsLeft: number;
  rounds: number;
};

export function Counter({ timeLeft, roundsLeft, rounds }: CounterProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-20">
        <span className="text-blue-600 text-lg font-bold">ROUND</span>
        <span className="text-4xl" data-testid={'round'}>{`${
          rounds - roundsLeft
        }/${rounds}`}</span>
      </div>
      <div className="">
        <div className=""></div>
        <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
      </div>
    </div>
  );
}
