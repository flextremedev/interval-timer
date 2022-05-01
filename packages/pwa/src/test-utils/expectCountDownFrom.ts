import { act } from '@testing-library/react';

const toTwoDigitString = (value) => (value < 10 ? `0${value}` : String(value));

const ONE_SECOND_IN_MS = 1000;

const isLastMinute = (minutes) => minutes <= 0;

export const expectCountDownFrom = ({
  seconds,
  minutes,
  toSeconds = 1,
  toMinutes = 0,
  timeLeftMinutes,
  timeLeftSeconds,
  advanceDateNowBy,
}: {
  seconds: number;
  minutes: number;
  toSeconds?: number;
  toMinutes?: number;
  timeLeftMinutes: HTMLInputElement;
  timeLeftSeconds: HTMLInputElement;
  advanceDateNowBy: (ms: number) => void;
}) => {
  let firstRound = true;

  const shouldDisplayInitialSeconds = (minutesLeft) =>
    minutesLeft >= 1 || (firstRound && minutesLeft <= 0);

  for (let minutesLeft = minutes; minutesLeft >= toMinutes; minutesLeft--) {
    const secondsToCountInMinute = shouldDisplayInitialSeconds(minutesLeft)
      ? seconds
      : 59;

    expect(timeLeftMinutes.value).toBe(toTwoDigitString(minutesLeft));
    let done = false;
    for (
      let secondsLeft = secondsToCountInMinute;
      secondsLeft >= (isLastMinute(minutesLeft) ? toSeconds : 0) && !done;

    ) {
      expect(timeLeftSeconds.value).toBe(toTwoDigitString(secondsLeft));
      if (isLastMinute(minutesLeft) ? secondsLeft > toSeconds : true) {
        secondsLeft -= 1;
        advanceDateNowBy(ONE_SECOND_IN_MS);
        act(() => {
          jest.advanceTimersByTime(ONE_SECOND_IN_MS);
        });
      } else {
        done = true;
      }
    }
    firstRound = false;
  }
};
