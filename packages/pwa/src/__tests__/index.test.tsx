import { fireEvent, screen, act } from '@testing-library/react';

import { MockWorker } from '../__mocks__/Worker';
import { expectCountDownFrom } from '../test-utils/expectCountDownFrom';
import { makeAdvanceDateNowBy } from '../test-utils/makeAdvanceDateNowBy';
import { renderApp } from '../test-utils/renderApp';

const ONE_SECOND_IN_MS = 1000;

const startDate = 1587574443099;
const play = jest.fn();

const buildAdvanceOneSecond =
  (advanceDateNowBy: (timeToAdvance: number) => void) => () => {
    advanceDateNowBy(ONE_SECOND_IN_MS);
    act(() => {
      jest.advanceTimersByTime(ONE_SECOND_IN_MS);
    });
  };

describe('Home', () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = play;
    HTMLMediaElement.prototype.pause = jest.fn();
    window.Worker = MockWorker as any;
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.Worker = undefined;
  });

  it('should work', () => {
    const {
      breakIntervalMinuteInput,
      breakIntervalSecondInput,
      prepTime,
      roundInput,
      startButton,
      workIntervalMinuteInput,
      workIntervalSecondInput,
    } = renderApp();

    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();

    const workMinutesValue = '1';
    const workSecondsValue = '1';
    const workMinutes = Number(workMinutesValue);
    const workSeconds = Number(workSecondsValue);

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';
    const breakMinutes = Number(breakMinutesValue);
    const breakSeconds = Number(breakSecondsValue);

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);
    const advanceOneSecond = buildAdvanceOneSecond(advanceDateNowBy);

    fireEvent.click(startButton);

    const timeLeftMinutes = screen.getAllByTestId(
      'time-left-minutes'
    )[0] as HTMLInputElement;

    const timeLeftSeconds = screen.getAllByTestId(
      'time-left-seconds'
    )[0] as HTMLInputElement;

    const round = screen.getAllByTestId('round')[0];

    expect(round.textContent).toBe('0/2');

    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    advanceOneSecond();

    expect(round.textContent).toBe('1/2');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    advanceOneSecond();

    expectCountDownFrom({
      minutes: breakMinutes,
      seconds: breakSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    advanceOneSecond();

    expect(round.textContent).toBe('2/2');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(play).toHaveBeenCalledTimes(15);
  });

  it('should stop timer when clicking button again', () => {
    const {
      breakIntervalMinuteInput,
      breakIntervalSecondInput,
      prepTime,
      roundInput,
      startButton,
      workIntervalMinuteInput,
      workIntervalSecondInput,
    } = renderApp();

    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();

    const workMinutesValue = '1';
    const workSecondsValue = '1';

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);

    fireEvent.click(startButton);

    const timeLeftSeconds = screen.getAllByTestId(
      'time-left-seconds'
    )[0] as HTMLInputElement;
    const round = screen.getAllByTestId('round')[0];

    expect(round.textContent).toBe('0/2');

    // 5, 4, 3, Stop
    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      toSeconds: 3,
      advanceDateNowBy,
      timeLeftMinutes: { value: '00' } as HTMLInputElement,
      timeLeftSeconds,
    });

    fireEvent.click(screen.getAllByRole('button', { name: /stop/i })[0]);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('should pause timer', () => {
    const {
      breakIntervalMinuteInput,
      breakIntervalSecondInput,
      prepTime,
      roundInput,
      startButton,
      workIntervalMinuteInput,
      workIntervalSecondInput,
    } = renderApp();

    expect(roundInput).toBeTruthy();
    expect(workIntervalMinuteInput).toBeTruthy();
    expect(workIntervalSecondInput).toBeTruthy();
    expect(breakIntervalMinuteInput).toBeTruthy();
    expect(breakIntervalSecondInput).toBeTruthy();
    expect(startButton).toBeTruthy();

    const workMinutesValue = '1';
    const workSecondsValue = '1';

    const breakMinutesValue = '1';
    const breakSecondsValue = '1';

    const roundsValue = '2';

    fireEvent.change(roundInput, { target: { value: roundsValue } });
    fireEvent.blur(roundInput);

    fireEvent.change(workIntervalMinuteInput, {
      target: { value: workMinutesValue },
    });
    fireEvent.change(workIntervalSecondInput, {
      target: { value: workSecondsValue },
    });

    fireEvent.change(breakIntervalMinuteInput, {
      target: { value: breakMinutesValue },
    });
    fireEvent.change(breakIntervalSecondInput, {
      target: { value: breakSecondsValue },
    });

    const advanceDateNowBy = makeAdvanceDateNowBy(startDate);
    const advanceOneSecond = buildAdvanceOneSecond(advanceDateNowBy);

    fireEvent.click(startButton);

    const timeLeftSeconds = screen.getAllByTestId(
      'time-left-seconds'
    )[0] as HTMLInputElement;
    const round = screen.getAllByTestId('round')[0];

    expect(round.textContent).toBe('0/2');

    // 5, 4, 3, Pause
    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      toSeconds: 3,
      advanceDateNowBy,
      timeLeftMinutes: { value: '00' } as HTMLInputElement,
      timeLeftSeconds,
    });

    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getAllByRole('button', { name: /pause/i })[0]);

    // 2, 1
    fireEvent.click(screen.getAllByRole('button', { name: /resume/i })[0]);
    advanceOneSecond();
    expectCountDownFrom({
      minutes: 0,
      seconds: 2,
      advanceDateNowBy,
      timeLeftMinutes: { value: '00' } as HTMLInputElement,
      timeLeftSeconds,
    });
    expect(play).toHaveBeenCalledTimes(3);
  });
});
