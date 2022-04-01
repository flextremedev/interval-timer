import { timerMachine, timerStates } from '@interval-timer/core';
import { useMachine } from '@xstate/react';
import { format } from 'date-fns';
import Head from 'next/head';
import * as React from 'react';
import { StateValue } from 'xstate';

import { Counter } from '../components/Counter/Counter';
import { Form } from '../components/Form/Form';
import { FormFields } from '../components/FormFields/FormFields';
import { useBeep } from '../hooks/useBeep';

const DEFAULT_DOCUMENT_TITLE = 'Flextreme Interval Timer';

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

  const startTimer = () => {
    send('START');
  };

  const stopTimer = () => {
    send('STOP');
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
      <main className="w-full flex flex-1 bg-white dark:bg-black justify-center">
        {state.value === timerStates.STOPPED ? (
          <Form
            breakInterval={breakInterval}
            rounds={rounds}
            setBreakInterval={setBreakInterval}
            setRounds={setRounds}
            setWorkInterval={setWorkInterval}
            onStart={startTimer}
            workInterval={workInterval}
          />
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
            onStop={stopTimer}
          />
        )}
      </main>
    </>
  );
}
