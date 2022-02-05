import * as React from 'react';

import { DurationInput } from '../DurationInput/DurationInput';
import { Input } from '../Input/Input';

type FormFieldsProps = {
  rounds: number;
  onRoundsChange: (rounds: number) => void;
  workInterval: Date;
  onWorkIntervalChange: (workInterval: Date) => void;
  breakInterval: Date;
  onBreakIntervalChange: (workInterval: Date) => void;
};

export function FormFields({
  rounds,
  onRoundsChange,
  breakInterval,
  onBreakIntervalChange,
  workInterval,
  onWorkIntervalChange,
}: FormFieldsProps) {
  return (
    <div className="not-last:mb-4">
      <Input
        label="ROUNDS"
        type="number"
        value={String(rounds)}
        onBlur={onRoundsChange}
        dataTestId="rounds-input"
        min="1"
      />
      <DurationInput
        value={workInterval}
        onChange={onWorkIntervalChange}
        dataTestId="work-interval-input"
        label="WORK INTERVAL"
      />
      <DurationInput
        value={breakInterval}
        onChange={onBreakIntervalChange}
        dataTestId="break-interval-input"
        label="REST INTERVAL"
      />
    </div>
  );
}
