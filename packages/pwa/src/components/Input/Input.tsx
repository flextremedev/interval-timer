import * as React from 'react';

type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'onBlur'
> & {
  value: string | number;
  label: string;
  onBlur?: (value: string | number) => void;
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
      <label className="text-blue-600 text-2xl lg:text-3xl leading-7 tracking-wider">
        {label}
      </label>
      <input
        className="text-black dark:text-white text-6xl lg:text-8xl outline-none text-center bg-transparent tracking-wide"
        type={type}
        style={{ width: `${(String(value).length || 1) * 0.375}em` }}
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
