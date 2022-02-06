import { useAudio } from './useAudio';
export const useBeep = () => {
  const { audio: beepBreak } = useAudio('/BeepBreak.mp3');
  const { audio: beepWork } = useAudio('/BeepWork.mp3');
  const { audio: beepBreakLong } = useAudio('/BeepBreakLong.mp3');
  const { audio: beepWorkLong } = useAudio('/BeepWorkLong.mp3');
  return {
    beepBreak,
    beepBreakLong,
    beepWork,
    beepWorkLong,
  };
};
