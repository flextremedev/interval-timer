/* istanbul ignore file */
/* covered by app integration test */
import { getMinutes, getSeconds, subSeconds } from 'date-fns';
import { assign, createMachine, MachineConfig, send } from 'xstate';

import { timerStates, TimerSubState } from '../model/timerStates';
import { hasOneSecondElapsed } from '../utils';

import {
  SetBreakIntervalEvent,
  SetRoundsEvent,
  SetWorkIntervalEvent,
  TimerContext,
  TimerEvent,
  TimerState,
  TimerStateSchema,
} from './types';

export const timerEvents: Record<TimerEvent['type'], TimerEvent['type']> = {
  START: 'START',
  WORK: 'WORK',
  BREAK: 'BREAK',
  STOP: 'STOP',
  TICK: 'TICK',
  PAUSE: 'PAUSE',
  SET_ROUNDS: 'SET_ROUNDS',
  SET_WORK_INTERVAL: 'SET_WORK_INTERVAL',
  SET_BREAK_INTERVAL: 'SET_BREAK_INTERVAL',
};

const SECONDS_PER_MINUTE = 60;

const getIntervalSeconds = (interval: Date): number =>
  getMinutes(interval) * SECONDS_PER_MINUTE + getSeconds(interval);

const countDown = (ctx: TimerContext): Partial<TimerContext> => {
  return {
    timestamp: Date.now(),
    timeLeft: subSeconds(ctx.timeLeft, 1),
  };
};
const shouldCountDown = (ctx: TimerContext): boolean => {
  return (
    (getSeconds(ctx.timeLeft) > 0 || getMinutes(ctx.timeLeft) > 0) &&
    hasOneSecondElapsed(ctx.timestamp)
  );
};

const timerMachineConfig: MachineConfig<
  TimerContext,
  TimerStateSchema,
  TimerEvent
> = {
  context: {
    prepareTime: new Date(5000),
    timeLeft: new Date(5000),
    rounds: 1,
    roundsLeft: 0,
    workInterval: new Date(0),
    breakInterval: new Date(0),
    timestamp: Date.now(),
  },
  initial: timerStates.STOPPED,
  states: {
    [timerStates.STOPPED]: {
      on: {
        [timerEvents.START]: {
          target: timerStates.PREWORK,
          cond: 'isReadyToStart',
        },
        [timerEvents.SET_ROUNDS]: {
          actions: 'assignRounds',
        },
        [timerEvents.SET_BREAK_INTERVAL]: {
          actions: 'assignBreakInterval',
        },
        [timerEvents.SET_WORK_INTERVAL]: {
          actions: 'assignWorkInterval',
        },
      },
      entry: send(timerEvents.STOP),
    },
    [timerStates.PREWORK]: {
      on: {
        [timerEvents.STOP]: timerStates.STOPPED,
      },
      initial: TimerSubState.RUNNING,
      states: {
        [TimerSubState.RUNNING]: {
          on: {
            [timerEvents.TICK]: [
              {
                actions: ['countDown', 'countDownLastWorkEffect'],
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            [timerEvents.PAUSE]: TimerSubState.PAUSED,
          },
        },
        [TimerSubState.PAUSED]: {
          on: {
            [timerEvents.PAUSE]: TimerSubState.RUNNING,
          },
        },
      },
      always: [
        {
          target: timerStates.STOPPED,
          cond: 'isDone',
        },
        {
          target: timerStates.WORK,
          cond: 'shouldTransition',
        },
      ],
      entry: 'initPrepare',
    },
    [timerStates.WORK]: {
      on: {
        [timerEvents.STOP]: timerStates.STOPPED,
      },
      initial: TimerSubState.RUNNING,
      states: {
        [TimerSubState.RUNNING]: {
          on: {
            [timerEvents.TICK]: [
              {
                actions: ['countDown', 'countDownLastWorkEffect'],
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            [timerEvents.PAUSE]: TimerSubState.PAUSED,
          },
        },
        [TimerSubState.PAUSED]: {
          on: {
            [timerEvents.PAUSE]: TimerSubState.RUNNING,
          },
        },
      },
      entry: ['initWork', 'initWorkEffect'],
      always: [
        {
          target: timerStates.STOPPED,
          cond: 'isDone',
        },
        {
          target: timerStates.BREAK,
          cond: 'shouldTransition',
        },
      ],
    },
    [timerStates.BREAK]: {
      on: {
        [timerEvents.STOP]: timerStates.STOPPED,
      },
      initial: TimerSubState.RUNNING,
      states: {
        [TimerSubState.RUNNING]: {
          on: {
            [timerEvents.TICK]: [
              {
                actions: ['countDown', 'countDownLastWorkEffect'],
                cond: 'shouldCountDownLast',
              },
              {
                actions: 'countDown',
                cond: 'shouldCountDown',
              },
            ],
            [timerEvents.PAUSE]: TimerSubState.PAUSED,
          },
        },
        [TimerSubState.PAUSED]: {
          on: {
            [timerEvents.PAUSE]: TimerSubState.RUNNING,
          },
        },
      },
      always: {
        target: timerStates.WORK,
        cond: 'shouldTransition',
      },
      entry: ['initBreak', 'initBreakEffect'],
    },
  },
};

export const timerMachine = createMachine<TimerContext, TimerEvent, TimerState>(
  timerMachineConfig,
  {
    actions: {
      assignBreakInterval: assign({
        breakInterval: (_context, event) => {
          return (event as SetBreakIntervalEvent).breakInterval;
        },
      }),
      assignRounds: assign({
        rounds: (_context, event) => {
          return (event as SetRoundsEvent).rounds;
        },
      }),
      assignWorkInterval: assign({
        workInterval: (_context, event) => {
          return (event as SetWorkIntervalEvent).workInterval;
        },
      }),
      initWorkEffect: () => {
        // test stub
      },
      initBreakEffect: () => {
        // test stub
      },
      countDown: assign(countDown),
      countDownLastWorkEffect: () => {
        // test stub
      },
      countDownLastBreakEffect: () => {
        // test stub
      },
      initBreak: assign({
        timeLeft: (ctx) => {
          return ctx.breakInterval;
        },
      }),
      initPrepare: assign<TimerContext, TimerEvent>({
        timestamp: () => {
          return Date.now();
        },
        roundsLeft: (ctx) => {
          return ctx.rounds;
        },
        timeLeft: (ctx) => {
          return ctx.prepareTime;
        },
      }),
      initWork: assign({
        timeLeft: (ctx) => {
          return ctx.workInterval;
        },
        roundsLeft: (ctx) => {
          return ctx.roundsLeft - 1;
        },
      }),
    },
    guards: {
      shouldCountDownLast: (ctx) => {
        const secondsLeft =
          getMinutes(ctx.timeLeft) * SECONDS_PER_MINUTE +
          getSeconds(ctx.timeLeft);
        const actualSecondsLeft = secondsLeft - 1;
        return (
          shouldCountDown(ctx) &&
          actualSecondsLeft <= 3 &&
          actualSecondsLeft > 0
        );
      },
      shouldTransition: (ctx) => {
        return (
          getMinutes(ctx.timeLeft) <= 0 &&
          getSeconds(ctx.timeLeft) <= 0 &&
          ctx.roundsLeft > 0
        );
      },
      shouldCountDown,
      isReadyToStart: ({ rounds, workInterval }) =>
        rounds > 0 && getIntervalSeconds(workInterval) > 0,
      isDone: (ctx) => {
        return (
          getMinutes(ctx.timeLeft) <= 0 &&
          getSeconds(ctx.timeLeft) <= 0 &&
          (ctx.roundsLeft <= 0 || getIntervalSeconds(ctx.workInterval) === 0)
        );
      },
    },
  }
);
