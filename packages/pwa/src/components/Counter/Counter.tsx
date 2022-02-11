import { getMinutes, getSeconds } from 'date-fns';
import * as React from 'react';

import { Arc } from '../Arc/Arc';
import { DurationInput } from '../DurationInput/DurationInput';

const SECONDS_PER_MINUTE = 60;

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
    (getSeconds(timeLeft) + getMinutes(timeLeft) * SECONDS_PER_MINUTE) /
      (getSeconds(timeTotal) + getMinutes(timeTotal) * SECONDS_PER_MINUTE);

  const stepLength =
    1 -
    (getSeconds(timeTotal) - 1 + getMinutes(timeTotal) * SECONDS_PER_MINUTE) /
      (getSeconds(timeTotal) + getMinutes(timeTotal) * SECONDS_PER_MINUTE);

  const transitionCompensationBasedFactor = factor + factor * stepLength;

  return (
    <div>
      <div className="flex flex-col items-center mb-20 z-[1]">
        <span className="text-blue-600 text-lg font-bold">ROUND</span>
        <span className="text-4xl" data-testid={'round'}>{`${
          rounds - roundsLeft
        }/${rounds}`}</span>
      </div>
      <div className="flex flex-col justify-center items-center relative w-72 h-72">
        <Arc
          className="absolute origin-center"
          factor={transitionCompensationBasedFactor}
        />
        <div className="z-[1]">
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
      </div>
    </div>
  );
}
