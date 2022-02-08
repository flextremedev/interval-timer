import * as React from 'react';

import { DurationInput } from '../DurationInput/DurationInput';
import { Arc } from '../Arc/Arc';
import { getMinutes, getSeconds } from 'date-fns';

type CounterProps = {
  timeLeft: Date;
  roundsLeft: number;
  rounds: number;
  timeTotal: Date;
};

export function Counter({
  timeTotal,
  timeLeft,
  roundsLeft,
  rounds,
}: CounterProps) {
  const factor =
    1 -
    (getSeconds(timeLeft) + getMinutes(timeLeft)) /
      (getSeconds(timeTotal) + getMinutes(timeTotal));

  return (
    <div>
      <div className="flex flex-col items-center mb-20 z-[1]">
        <span className="text-blue-600 text-lg font-bold">ROUND</span>
        <span className="text-4xl" data-testid={'round'}>{`${
          rounds - roundsLeft
        }/${rounds}`}</span>
      </div>
      <div className="flex flex-col justify-center items-center relative w-72 h-72">
        <Arc className="absolute origin-center" factor={factor} />
        <div className="z-[1]">
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
      </div>
    </div>
  );
}
