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
      <label className="text-blue-600 text-2xl leading-7 tracking-wider">
        {label}
      </label>
      <input
        className="text-black text-7xl outline-none text-center bg-transparent"
        type={type}
        style={{ width: `${(String(value).length || 1) * 0.34}em` }}
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
