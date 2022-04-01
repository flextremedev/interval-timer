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
  onStop: () => void;
};

export function Counter({
  timeTotal,
  timeLeft,
  roundsLeft,
  rounds,
  onStop,
}: CounterProps) {
  const timeLeftInSeconds =
    getSeconds(timeLeft) + getMinutes(timeLeft) * SECONDS_PER_MINUTE;
  const timeLeftAdvancedByOneInSeconds =
    getSeconds(timeTotal) - 1 + getMinutes(timeTotal) * SECONDS_PER_MINUTE;
  const timeTotalInSeconds =
    getSeconds(timeTotal) + getMinutes(timeTotal) * SECONDS_PER_MINUTE;

  const factor = 1 - timeLeftInSeconds / timeTotalInSeconds;

  const stepLength = 1 - timeLeftAdvancedByOneInSeconds / timeTotalInSeconds;

  const counterDesktop = (
    <div className="h-full w-full lg:max-w-screen-md hidden lg:flex justify-center flex-col items-center">
      <div className="flex flex-col justify-between w-full h-3/6 items-center relative">
        <div className="flex flex-1 flex-col items-center z-[1]">
          <span className="text-blue-600 text-3xl tracking-wider">ROUND</span>
          <span
            className="text-black dark:text-white text-5xl"
            data-testid={'round'}
          >{`${rounds - roundsLeft}/${rounds}`}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center items-center">
          <Arc
            key={factor === 0 ? 'arc-from-start' : 'arc-running'}
            className="absolute origin-center"
            progress={factor * 100}
            progressPerSecond={stepLength * 100}
          />
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
        <div className="flex flex-1 flex-col justify-end z-10">
          <button
            className="text-white bg-blue-600 text-3xl px-12 h-20 rounded-full tracking-widest"
            onClick={onStop}
          >
            STOP
          </button>
        </div>
      </div>
    </div>
  );
  const counterMobile = (
    <div className="h-full flex lg:hidden justify-center flex-col items-center">
      <div className="flex-[0.75]" />
      <div className="flex-1">
        <div className="flex flex-col items-center mb-8 z-[1]">
          <span className="text-blue-600 text-2xl tracking-wider mb-1">
            ROUND
          </span>
          <span
            className="text-4xl text-black dark:text-white"
            data-testid={'round'}
          >{`${rounds - roundsLeft}/${rounds}`}</span>
        </div>
        <div className="flex flex-col justify-center items-center relative w-72 h-72 mb-16">
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
      <div className="flex-1 flex flex-col justify-center">
        <button
          className="text-white bg-blue-600 text-2xl px-12 h-14 rounded-full tracking-widest"
          onClick={onStop}
        >
          STOP
        </button>
      </div>
    </div>
  );

  return (
    <>
      {counterMobile}
      {counterDesktop}
    </>
  );
}
