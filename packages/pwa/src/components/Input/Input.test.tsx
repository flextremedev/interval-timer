import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import { Input } from './Input';

describe('Input', () => {
  it('should trigger onChange when value has changed', () => {
    const handleChange = jest.fn();
    const value = 'Hello';
    const { getByDisplayValue } = render(
      <Input value={value} onChange={handleChange} label="Test input" />
    );
    const input = getByDisplayValue(value);
    fireEvent.change(input, { target: { value: 'Hello!' } });
    expect(handleChange).toHaveBeenCalled();
  });
  it('should have width of value.length times 0.625em and at least 0.625em', () => {
    const value = 'Hello';
    const { getByDisplayValue, rerender } = render(
      <Input value={value} readOnly label="Test input" />
    );
    let input = getByDisplayValue(value);
    expect(input.style.width).toBe('3.125em');
    rerender(<Input value="" readOnly label="Test input" />);
    input = getByDisplayValue('');
    expect(input.style.width).toBe('0.625em');
  });
  test('type number should work correctly and allow no empty input after blur', () => {
    const handleChange = jest.fn();
    const handleBlur = jest.fn();
    const value = '1';
    const { getByDisplayValue, rerender } = render(
      <Input
        value={value}
        label="Test input"
        type="number"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
    const input = getByDisplayValue(String(value));
    expect(input).toBeInTheDocument();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
      })
    );
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledWith('');
    rerender(
      <Input
        value={''}
        type="number"
        label="Test input"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
    expect(getByDisplayValue('0')).toBeInTheDocument();
  });
});
