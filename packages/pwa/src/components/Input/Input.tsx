import * as React from 'react';
import styles from './Input.module.css';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value: string;
  label: string;
  onBlur?: (value: string) => void;
  dataTestId?: string;
};

export function Input({
  label,
  type,
  value: valueFromProps,
  onChange,
  onBlur,
  min,
  max,
  dataTestId,
  readOnly,
}: InputProps) {
  const [value, setValue] = React.useState(valueFromProps);
  const [inputDone, setInputDone] = React.useState(true);
  const inputRef = React.useRef(null);
  if (valueFromProps !== value && inputDone) {
    setValue(valueFromProps);
  }
  const handleChange = (e) => {
    setInputDone(false);
    setValue(e.target.value);
    onChange?.(e);
  };
  const handleFocus = () => {
    inputRef.current.select();
  };
  const handleBlur = () => {
    setInputDone(true);
    onBlur?.(value);
  };

  const evaluateValue = () => {
    return inputDone && type === 'number' ? Number(value) : value;
  };
  return (
    <div className="flex flex-col items-center">
      <label className="text-blue-600 text-lg font-bold leading-7">
        {label}
      </label>
      <input
        className="text-black text-6xl"
        type={type}
        style={{ width: `${(String(value).length || 1) * 0.625}em` }}
        value={evaluateValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        min={min}
        max={max}
        data-testid={dataTestId}
        readOnly={readOnly}
        ref={inputRef}
      ></input>
    </div>
  );
}
