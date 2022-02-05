import { FormFields } from '../components/FormFields/FormFields';
import { timerMachine } from '@interval-timer/core';
import { useMachine } from '@xstate/react';

export default function Home() {
  const [state, send] = useMachine(timerMachine);

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

  const { breakInterval, rounds, workInterval } = state.context;

  return (
    <>
      <header />
      <main className="flex-1">
        <div className="h-full flex flex-col items-stretch bg-blue-600">
          <div className="flex flex-col justify-center flex-1 bg-white rounded-b-3xl">
            <FormFields
              rounds={rounds}
              onRoundsChange={setRounds}
              breakInterval={breakInterval}
              onBreakIntervalChange={setBreakInterval}
              workInterval={workInterval}
              onWorkIntervalChange={setWorkInterval}
            ></FormFields>
          </div>
          <div className="flex flex-col items-center flex-[0.25] pt-8 ">
            <button className="text-blue-600 bg-white text-xl px-8 h-14 rounded-full font-semibold">
              Start
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
