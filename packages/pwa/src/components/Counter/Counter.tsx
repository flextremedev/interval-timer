import { TimerSubState } from '@interval-timer/core';
import { getMinutes, getSeconds } from 'date-fns';
import dynamic from 'next/dynamic';
import * as React from 'react';

import { Arc } from '../Arc/Arc';
import { DurationInput } from '../DurationInput/DurationInput';
import { Logo } from '../Logo/Logo';

const ThemeToggle = dynamic(
  () =>
    import('../ThemeToggle/ThemeToggle').then((module) => module.ThemeToggle),
  {
    ssr: false,
  }
);

const SECONDS_PER_MINUTE = 60;

type CounterProps = {
  timeLeft: Date;
  roundsLeft: number;
  rounds: number;
  timeTotal: Date;
  onStop: () => void;
  onPause: () => void;
  stateValues: string[];
};

export function Counter({
  timeTotal,
  timeLeft,
  roundsLeft,
  rounds,
  onStop,
  onPause,
  stateValues,
}: CounterProps) {
  const timeLeftInSeconds =
    getSeconds(timeLeft) + getMinutes(timeLeft) * SECONDS_PER_MINUTE;
  const timeLeftAdvancedByOneInSeconds =
    getSeconds(timeTotal) - 1 + getMinutes(timeTotal) * SECONDS_PER_MINUTE;
  const timeTotalInSeconds =
    getSeconds(timeTotal) + getMinutes(timeTotal) * SECONDS_PER_MINUTE;

  const factor = 1 - timeLeftInSeconds / timeTotalInSeconds;

  const stepLength = 1 - timeLeftAdvancedByOneInSeconds / timeTotalInSeconds;

  const [parentState, childState] = stateValues;

  const counterDesktop = (
    <div className="h-full w-full lg:max-w-screen-xl hidden lg:flex justify-between flex-col items-center">
      <div className="w-full flex">
        <div className="h-20 w-full flex justify-between items-center px-6">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col w-[min(75vh,50vw)] h-[min(75vh,50vw)] justify-evenly py-8 items-center relative">
        <div className="flex flex-col items-center z-[1]">
          <span className="text-blue-600 text-2xl 2xl:text-3xl tracking-wider">
            ROUND
          </span>
          <span
            className="text-black dark:text-white text-4xl 2xl:text-5xl"
            data-testid={'round'}
          >{`${rounds - roundsLeft}/${rounds}`}</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Arc
            key={parentState}
            className="absolute origin-center"
            progress={factor * 100}
            progressPerSecond={stepLength * 100}
          />
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
        <div className="flex justify-center z-10 w-full mb-8">
          <div className="flex flex-1 justify-end">
            <button
              className="text-white bg-blue-600 text-2xl 2xl:text-3xl px-12 h-16 2xl:h-20 rounded-full tracking-widest mr-4"
              onClick={onStop}
            >
              STOP
            </button>
          </div>
          <div className="flex-1">
            <button
              className="text-white bg-blue-600 text-2xl 2xl:text-3xl px-12 h-16 2xl:h-20 rounded-full tracking-widest ml-4"
              onClick={onPause}
            >
              {childState.endsWith(TimerSubState.RUNNING) ? 'PAUSE' : 'RESUME'}
            </button>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
  const counterMobile = (
    <div className="h-full w-full flex lg:hidden justify-center flex-col items-center">
      <div className="flex-[0.75] w-full flex">
        <div className="h-20 w-full flex justify-between items-center px-6">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
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
            key={parentState}
            className="absolute origin-center"
            progress={factor * 100}
            progressPerSecond={stepLength * 100}
          />
          <div className="z-[1]">
            <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center w-full">
        <div className="flex flex-1 justify-end">
          <button
            className="text-white bg-blue-600 text-2xl px-12 h-14 rounded-full tracking-widest mr-4"
            onClick={onStop}
          >
            STOP
          </button>
        </div>
        <div className="flex-1">
          <button
            className="text-white bg-blue-600 text-2xl px-12 h-14 rounded-full tracking-widest ml-4"
            onClick={onPause}
          >
            {childState.endsWith(TimerSubState.RUNNING) ? 'PAUSE' : 'RESUME'}
          </button>
        </div>
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
