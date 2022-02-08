export const useAudio = (url: string) => {
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return { audio: undefined };
  }

  const audio = new Audio(url);
  return { audio };
};
