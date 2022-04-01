import { FormFields } from '../FormFields/FormFields';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

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
    <div className="h-full w-full flex max-w-screen-xl justify-center flex-col items-center">
      <div className="flex-[0.75] w-full flex">
        <div className="h-20 w-full flex justify-end items-center px-6">
          <ThemeToggle />
        </div>
      </div>
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
