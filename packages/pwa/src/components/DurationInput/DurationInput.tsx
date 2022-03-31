import { format, setSeconds, setMinutes } from 'date-fns';
import * as React from 'react';

import { addNumberAtEndShifting } from './addNumberAtEndShifting';

type DurationInputProps = {
  value: Date;
  label?: string;
  readOnly?: boolean;
  onChange?: (value: Date) => void;
  dataTestId?: string;
  inputClassName?: string;
};

export function DurationInput({
  dataTestId,
  value,
  onChange,
  label,
  readOnly,
}: DurationInputProps) {
  const formattedMinutes = format(value, 'mm');
  const formattedSeconds = format(value, 'ss');
  const minutesRef = React.useRef(null);
  const secondsRef = React.useRef(null);

  React.useEffect(() => {
    /* istanbul ignore else */
    if (secondsRef.current) {
      secondsRef.current.setSelectionRange(0, 0);
    }
    /* istanbul ignore else */
    if (minutesRef.current) {
      minutesRef.current.setSelectionRange(0, 0);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { value: targetValue, name } = e.target;
    if (targetValue.match(/^[0-9]*$/)) {
      if (name === 'minutes') {
        const formattedTargetValue = addNumberAtEndShifting(
          formattedMinutes,
          targetValue
        );
        onChange?.(setMinutes(new Date(value.valueOf()), formattedTargetValue));
      } else {
        const formattedTargetValue = addNumberAtEndShifting(
          formattedSeconds,
          targetValue
        );
        onChange?.(setSeconds(new Date(value.valueOf()), formattedTargetValue));
      }
    }
  };
  const handleMinutesSelect = (e) => {
    e.preventDefault();
    if (!readOnly) {
      minutesRef.current.select();
    }
  };
  const handleMinutesBlur = () => {
    minutesRef.current.selectionEnd = minutesRef.current.selectionStart;
  };
  const handleSecondsSelect = (e) => {
    e.preventDefault();
    if (!readOnly) {
      secondsRef.current.select();
    }
  };
  const handleSecondsBlur = () => {
    secondsRef.current.selectionEnd = secondsRef.current.selectionStart;
  };
  /* istanbul ignore next */
  const handlePaste = (e) => {
    e.preventDefault();
  };

  const inputClassName = `text-black text-center outline-none w-16 ${
    readOnly ? 'lg:w-32' : 'lg:w-20'
  } bg-transparent tracking-wide`;

  return (
    <div className="flex flex-col items-center">
      {label ? (
        <label className="text-blue-600 text-2xl lg:text-3xl tracking-wider">
          {label}
        </label>
      ) : null}
      <div
        className={`flex flex-row justify-center items-center text-black text-6xl ${
          readOnly ? 'lg:text-[180px]' : 'lg:text-8xl'
        } box-content w-full`}
      >
        <input
          type="text"
          name="minutes"
          value={formattedMinutes}
          onChange={handleChange}
          onPaste={handlePaste}
          onMouseDown={handleMinutesSelect}
          onBlur={handleMinutesBlur}
          onFocus={handleMinutesSelect}
          onSelect={handleMinutesSelect}
          data-testid={dataTestId && `${dataTestId}-minutes`}
          className={inputClassName}
          ref={minutesRef}
          readOnly={readOnly}
          size={2}
          inputMode="numeric"
        />
        :
        <input
          type="text"
          name="seconds"
          value={formattedSeconds}
          onChange={handleChange}
          onPaste={handlePaste}
          onMouseDown={handleSecondsSelect}
          onBlur={handleSecondsBlur}
          onFocus={handleSecondsSelect}
          onSelect={handleSecondsSelect}
          data-testid={dataTestId && `${dataTestId}-seconds`}
          className={inputClassName}
          ref={secondsRef}
          readOnly={readOnly}
          size={2}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
