import * as React from 'react';

import { DurationInput } from '../DurationInput/DurationInput';
import { Arc } from '../Arc/Arc';

type CounterProps = {
  timeLeft: Date;
  roundsLeft: number;
  rounds: number;
};

export function Counter({ timeLeft, roundsLeft, rounds }: CounterProps) {
  return (
    <div>
      <div className="flex flex-col items-center mb-20 z-[1]">
        <span className="text-blue-600 text-lg font-bold">ROUND</span>
        <span className="text-4xl" data-testid={'round'}>{`${
          rounds - roundsLeft
        }/${rounds}`}</span>
      </div>
      <div className="flex flex-col justify-center items-center relative w-72 h-72">
        <Arc className="absolute" />
        <div className="z-[1]">
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
      </div>
    </div>
  );
}
