export type AudioCaptureSupport = "with-audio" | "video-only";

export type RecorderSetupResult = {
  stream: MediaStream;
  audioCaptureSupport: AudioCaptureSupport;
};

type CaptureStreamAudioElement = HTMLAudioElement & {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
};

export const getAudioStreamFromElement = (
  audioElement: HTMLAudioElement | null
): MediaStream | null => {
  if (!audioElement) return null;

  const streamCapableElement = audioElement as CaptureStreamAudioElement;
  const captureStreamFn =
    streamCapableElement.captureStream ?? streamCapableElement.mozCaptureStream;

  if (!captureStreamFn) return null;

  try {
    return captureStreamFn.call(streamCapableElement);
  } catch (error) {
    console.warn("Audio captureStream failed. Fallback to video only.", error);
    return null;
  }
};

export const combineCanvasAndAudioStreams = (
  canvasStream: MediaStream,
  audioStream: MediaStream | null
): RecorderSetupResult => {
  const mixedStream = new MediaStream();

  canvasStream.getVideoTracks().forEach((track) => {
    mixedStream.addTrack(track);
  });

  if (!audioStream) {
    return {
      stream: mixedStream,
      audioCaptureSupport: "video-only",
    };
  }

  const audioTracks = audioStream.getAudioTracks();

  if (audioTracks.length === 0) {
    return {
      stream: mixedStream,
      audioCaptureSupport: "video-only",
    };
  }

  audioTracks.forEach((track) => {
    mixedStream.addTrack(track);
  });

  return {
    stream: mixedStream,
    audioCaptureSupport: "with-audio",
  };
};
