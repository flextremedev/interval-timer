import { FormFields } from '../FormFields/FormFields';

type FormProps = {
  rounds: number;
  setRounds: (rounds: number) => void;
  breakInterval: Date;
  setBreakInterval: (breakInterval: Date) => void;
  workInterval: Date;
  setWorkInterval: (workInterval: Date) => void;
  onStart: () => void;
};

export const Form = ({
  breakInterval,
  rounds,
  setBreakInterval,
  setRounds,
  setWorkInterval,
  onStart,
  workInterval,
}: FormProps) => {
  return (
    <div className="h-full flex justify-center flex-col items-center">
      <div className="flex-[0.75]" />
      <div className="flex-1">
        <FormFields
          rounds={rounds}
          onRoundsChange={setRounds}
          breakInterval={breakInterval}
          onBreakIntervalChange={setBreakInterval}
          workInterval={workInterval}
          onWorkIntervalChange={setWorkInterval}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center lg:justify-start lg:mt-12 ">
        <button
          className="text-white bg-blue-600 text-2xl lg:text-3xl px-12 h-14 lg:h-20 rounded-full tracking-widest"
          onClick={onStart}
        >
          START
        </button>
      </div>
    </div>
  );
};
