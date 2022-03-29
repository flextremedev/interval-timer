import { timerMachine, timerStates } from '@interval-timer/core';
import { useMachine } from '@xstate/react';
import { format } from 'date-fns';
import Head from 'next/head';
import * as React from 'react';
import { StateValue } from 'xstate';

import { Counter } from '../components/Counter/Counter';
import { FormFields } from '../components/FormFields/FormFields';
import { useBeep } from '../hooks/useBeep';

const DEFAULT_DOCUMENT_TITLE = 'Interval Timer';

const getActiveTimeTotal = ({
  breakInterval,
  prepareTime,
  value,
  workInterval,
}: {
  value: StateValue;
  breakInterval: Date;
  workInterval: Date;
  prepareTime: Date;
}) => {
  if (value === timerStates.WORK) {
    return workInterval;
  }

  if (value === timerStates.BREAK) {
    return breakInterval;
  }

  return prepareTime;
};

export default function Home() {
  const { beepBreak, beepBreakLong, beepWork, beepWorkLong } = useBeep();
  const [state, send, service] = useMachine(timerMachine, {
    actions: {
      initBreakEffect: () => {
        beepBreakLong.play();
      },
      initWorkEffect: () => {
        beepWorkLong.play();
      },
      countDownLastWorkEffect: () => {
        beepWork.pause();
        beepWork.currentTime = 0;
        beepWork.play();
      },
      countDownLastBreakEffect: () => {
        beepBreak.pause();
        beepBreak.currentTime = 0;
        beepBreak.play();
      },
    },
  });

  React.useEffect(() => {
    const intervalWorker = new Worker('/intervalWorker.js');

    intervalWorker.addEventListener('message', () => {
      service.send({ type: 'TICK' });
    });

    const subscription = service.subscribe(((_state, event) => {
      if (event && (event.type === 'START' || event.type === 'STOP')) {
        intervalWorker.postMessage(event.type);
      }
    }) as any);

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  const toggleTimer = () => {
    if (state.value === timerStates.STOPPED) {
      send('START');
    } else {
      send('STOP');
    }
  };

  const setRounds = (rounds: number) => {
    send({ type: 'SET_ROUNDS', rounds: Number(rounds) });
  };

  const setWorkInterval = (workInterval: Date) => {
    send({
      type: 'SET_WORK_INTERVAL',
      workInterval,
    });
  };

  const setBreakInterval = (breakInterval: Date) => {
    send({
      type: 'SET_BREAK_INTERVAL',
      breakInterval,
    });
  };

  const {
    breakInterval,
    rounds,
    workInterval,
    timeLeft,
    roundsLeft,
    prepareTime,
  } = state.context;

  return (
    <>
      <Head>
        <title>
          {!state.matches(timerStates.STOPPED)
            ? `${format(timeLeft, 'mm:ss')} | ${DEFAULT_DOCUMENT_TITLE}`
            : DEFAULT_DOCUMENT_TITLE}
        </title>
      </Head>
      <header />
      <main className="flex-1">
        <div className="h-full flex flex-col items-stretch bg-blue-600">
          <div className="flex flex-col justify-center items-center flex-1 bg-white rounded-b-3xl">
            {state.value === timerStates.STOPPED ? (
              <FormFields
                rounds={rounds}
                onRoundsChange={setRounds}
                breakInterval={breakInterval}
                onBreakIntervalChange={setBreakInterval}
                workInterval={workInterval}
                onWorkIntervalChange={setWorkInterval}
              ></FormFields>
            ) : (
              <Counter
                timeTotal={getActiveTimeTotal({
                  breakInterval,
                  prepareTime,
                  value: state.value,
                  workInterval,
                })}
                timeLeft={timeLeft}
                roundsLeft={roundsLeft}
                rounds={rounds}
              />
            )}
          </div>
          <div className="flex flex-col items-center flex-[0.25] pt-8 ">
            <button
              className="text-blue-600 bg-white text-3xl px-12 h-16 rounded-full tracking-widest"
              onClick={toggleTimer}
            >
              {state.matches(timerStates.STOPPED) ? 'START' : 'STOP'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
