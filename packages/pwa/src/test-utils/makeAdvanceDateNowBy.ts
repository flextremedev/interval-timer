export function makeAdvanceDateNowBy(initialDate: number) {
  let date = initialDate;
  Date.now = () => date;
  return function advanceDateNowBy(millisecondsToAdvance: number) {
    date += millisecondsToAdvance;
    Date.now = () => date;
  };
}
