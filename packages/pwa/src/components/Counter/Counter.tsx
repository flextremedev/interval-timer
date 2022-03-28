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
  const timeLeftInSeconds =
    getSeconds(timeLeft) + getMinutes(timeLeft) * SECONDS_PER_MINUTE;
  const timeLeftAdvancedByOneInSeconds =
    getSeconds(timeTotal) - 1 + getMinutes(timeTotal) * SECONDS_PER_MINUTE;
  const timeTotalInSeconds =
    getSeconds(timeTotal) + getMinutes(timeTotal) * SECONDS_PER_MINUTE;

  const factor = 1 - timeLeftInSeconds / timeTotalInSeconds;

  const stepLength = 1 - timeLeftAdvancedByOneInSeconds / timeTotalInSeconds;

  return (
    <div>
      <div className="flex flex-col items-center mb-8 lg:mb-20 z-[1]">
        <span className="text-blue-600 text-3xl tracking-wider mb-1">
          ROUND
        </span>
        <span className="text-4xl" data-testid={'round'}>{`${
          rounds - roundsLeft
        }/${rounds}`}</span>
      </div>
      <div className="flex flex-col justify-center items-center relative w-64 sm:w-72 lg:w-80 h-64 sm:h-72 lg:h-80">
        <Arc
          key={factor === 0 ? 'arc-from-start' : 'arc-running'}
          className="absolute origin-center"
          progress={factor * 100}
          progressPerSecond={stepLength * 100}
        />
        <div className="z-[1]">
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
      </div>
    </div>
  );
}
