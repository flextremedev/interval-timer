import { fireEvent, screen } from '@testing-library/react';
import { MockWorker } from '../__mocks__/Worker';
import { expectCountDownFrom } from '../test-utils/expectCountDownFrom';
import { makeAdvanceDateNowBy } from '../test-utils/makeAdvanceDateNowBy';
import { renderApp } from '../test-utils/renderApp';

const startDate = 1587574443099;

describe('Home', () => {
  beforeEach(() => {
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

    fireEvent.click(startButton);

    const timeLeftMinutes = screen.getByTestId(
      'time-left-minutes'
    ) as HTMLInputElement;

    const timeLeftSeconds = screen.getByTestId(
      'time-left-seconds'
    ) as HTMLInputElement;

    const round = screen.getByTestId('round');

    expect(round.textContent).toBe('0/2');

    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(round.textContent).toBe('1/2');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expectCountDownFrom({
      minutes: breakMinutes,
      seconds: breakSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });

    expect(round.textContent).toBe('2/2');

    expectCountDownFrom({
      minutes: workMinutes,
      seconds: workSeconds,
      advanceDateNowBy,
      timeLeftMinutes,
      timeLeftSeconds,
    });
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

    const timeLeftSeconds = screen.getByTestId(
      'time-left-seconds'
    ) as HTMLInputElement;
    const round = screen.getByTestId('round');

    expect(round.textContent).toBe('0/2');

    // count down from 00:05 and stop after two seconds
    expectCountDownFrom({
      minutes: 0,
      seconds: prepTime,
      toSeconds: 3,
      advanceDateNowBy,
      timeLeftMinutes: { value: '00' } as HTMLInputElement,
      timeLeftSeconds,
    });

    fireEvent.click(startButton);
  });
});
