import { StateSchema } from 'xstate';

import { timerStates, TimerSubState } from '../model/timerStates';

export type TimerContext = {
  prepareTime: Date;
  timeLeft: Date;
  rounds: number;
  roundsLeft: number;
  workInterval: Date;
  breakInterval: Date;
  timestamp: number;
};

export type SetRoundsEvent = {
  type: 'SET_ROUNDS';
  rounds: number;
};

export type SetBreakIntervalEvent = {
  type: 'SET_BREAK_INTERVAL';
  breakInterval: Date;
};

export type SetWorkIntervalEvent = {
  type: 'SET_WORK_INTERVAL';
  workInterval: Date;
};

export type BaseEvent = {
  type: 'START' | 'STOP' | 'BREAK' | 'WORK' | 'TICK' | 'PAUSE';
};
export type TimerEvent =
  | SetRoundsEvent
  | SetBreakIntervalEvent
  | SetWorkIntervalEvent
  | BaseEvent;

type TimerNestedStateSchema = {
  states: Record<TimerSubState, StateSchema>;
};

export type TimerStateSchema = {
  states: Record<keyof typeof timerStates, TimerNestedStateSchema>;
};

export type TimerState = {
  value: keyof TimerStateSchema['states'];
  context: TimerContext;
};
