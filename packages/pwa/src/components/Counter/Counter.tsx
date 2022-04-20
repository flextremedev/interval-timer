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
  state: string;
};

export function Counter({
  timeTotal,
  timeLeft,
  roundsLeft,
  rounds,
  onStop,
  state,
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
    <div className="h-full w-full lg:max-w-screen-xl hidden lg:flex justify-between flex-col items-center">
      <div className="w-full flex">
        <div className="h-20 w-full flex justify-between items-center px-6">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col max-w-screen-sm 2xl:max-w-screen-md justify-evenly w-full h-full max-h-[640px] 2xl:max-h-[768px] items-center relative">
        <div className="flex flex-col items-center z-[1]">
          <span className="text-blue-600 text-3xl tracking-wider">ROUND</span>
          <span
            className="text-black dark:text-white text-5xl"
            data-testid={'round'}
          >{`${rounds - roundsLeft}/${rounds}`}</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Arc
            key={state}
            className="absolute origin-center"
            progress={factor * 100}
            progressPerSecond={stepLength * 100}
          />
          <DurationInput value={timeLeft} readOnly dataTestId={'time-left'} />
        </div>
        <div className="flex flex-col justify-end z-10">
          <button
            className="text-white bg-blue-600 text-3xl px-12 h-20 rounded-full tracking-widest"
            onClick={onStop}
          >
            STOP
          </button>
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
            key={state}
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
