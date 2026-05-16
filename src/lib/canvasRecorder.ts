export const createExportCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  return canvas;
};

const imageCache = new Map<string, HTMLImageElement>();

const loadImage = async (imageUrl: string): Promise<HTMLImageElement> => {
  const cachedImage = imageCache.get(imageUrl);

  if (cachedImage) return cachedImage;

  const image = new Image();
  image.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
  });

  imageCache.set(imageUrl, image);

  return image;
};

export const drawImageToCanvas = async (
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  width: number,
  height: number
): Promise<void> => {
  const image = await loadImage(imageUrl);

  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

export const drawTextOverlay = (
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number
): void => {
  if (!text) return;

  const fontSize = Math.max(28, Math.round(width * 0.045));
  ctx.font = `900 ${fontSize}px sans-serif`;
  ctx.textBaseline = "bottom";
  ctx.lineWidth = Math.max(4, Math.round(fontSize * 0.12));
  ctx.strokeStyle = "rgba(0, 0, 0, 0.95)";
  ctx.fillStyle = "#ffffff";

  const x = Math.round(width * 0.06);
  const y = Math.round(height * 0.9);

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
};

export type CanvasOverlayPosition =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "center";

export type CanvasOverlayDrawOptions = {
  selectedImage: string | null;
  sfxText: string;
  sfxPosition: CanvasOverlayPosition;
  bubbleText: string;
  bubblePosition: CanvasOverlayPosition;
  showSfx: boolean;
  showBubble: boolean;
  showGlitch: boolean;
  showEqualizer: boolean;
  eqBars: number[];
  showPanels: boolean;
  panelPattern: "classic" | "vertical" | "horizontal" | "diagonal" | "action";
  flashActive: boolean;
  chorusBoost: boolean;
  frame: number;
};

const getAnchor = (position: CanvasOverlayPosition, width: number, height: number) => {
  const paddingX = width * 0.08;
  const paddingY = height * 0.11;
  switch (position) {
    case "topLeft": return { x: paddingX, y: paddingY };
    case "topRight": return { x: width - paddingX, y: paddingY };
    case "bottomLeft": return { x: paddingX, y: height - paddingY };
    case "bottomRight": return { x: width - paddingX, y: height - paddingY };
    case "center": return { x: width * 0.5, y: height * 0.5 };
  }
};

export const drawCoverImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, canvasWidth: number, canvasHeight: number): void => {
  const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

export const drawSpeechBubble = (ctx: CanvasRenderingContext2D, text: string, position: CanvasOverlayPosition, canvasWidth: number, canvasHeight: number): void => {
  if (!text) return;
  const p = getAnchor(position, canvasWidth, canvasHeight);
  const fontSize = Math.max(20, Math.round(Math.min(canvasWidth, canvasHeight) * 0.045));
  ctx.font = `800 ${fontSize}px sans-serif`;
  const w = Math.min(canvasWidth * 0.45, ctx.measureText(text).width + fontSize * 1.8);
  const h = fontSize * 2.2;
  const x = Math.max(24, Math.min(canvasWidth - w - 24, p.x - w / 2));
  const y = Math.max(24, Math.min(canvasHeight - h - 24, p.y - h / 2));
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(3, Math.round(fontSize * 0.12));
  ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.textAlign = "start";
};

export const drawSfxText = (ctx: CanvasRenderingContext2D, text: string, position: CanvasOverlayPosition, canvasWidth: number, canvasHeight: number): void => {
  if (!text) return;
  const p = getAnchor(position, canvasWidth, canvasHeight);
  const fontSize = Math.max(36, Math.round(Math.min(canvasWidth, canvasHeight) * 0.11));
  ctx.font = `900 ${fontSize}px sans-serif`;
  ctx.textAlign = position.includes("Right") ? "right" : position === "center" ? "center" : "left";
  ctx.textBaseline = "middle";
  ctx.lineWidth = Math.max(5, Math.round(fontSize * 0.1));
  ctx.strokeStyle = "rgba(0,0,0,0.92)";
  ctx.fillStyle = "#ffffff";
  ctx.strokeText(text, p.x, p.y);
  ctx.fillText(text, p.x, p.y);
  ctx.textAlign = "start";
};

export const drawGlitchLines = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, frame: number): void => {
  for (let i = 0; i < 4; i++) {
    const y = (frame * 7 + i * canvasHeight * 0.23) % canvasHeight;
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.18)" : "rgba(34,211,238,0.14)";
    ctx.fillRect(0, y, canvasWidth, 2 + (i % 3));
  }
};

export const drawEqualizerBars = (ctx: CanvasRenderingContext2D, eqBars: number[], canvasWidth: number, canvasHeight: number): void => {
  const barWidth = Math.max(6, canvasWidth * 0.012);
  const gap = barWidth * 0.45;
  const baseX = canvasWidth - (barWidth + gap) * eqBars.length - canvasWidth * 0.04;
  const baseY = canvasHeight - canvasHeight * 0.05;
  eqBars.forEach((bar, idx) => {
    const h = Math.max(12, (bar / 100) * canvasHeight * 0.22);
    ctx.fillStyle = "rgba(34,211,238,0.9)";
    ctx.fillRect(baseX + idx * (barWidth + gap), baseY - h, barWidth, h);
  });
};

export const drawComicPanels = (ctx: CanvasRenderingContext2D, panelPattern: CanvasOverlayDrawOptions["panelPattern"], canvasWidth: number, canvasHeight: number): void => {
  ctx.strokeStyle = "rgba(0,0,0,0.75)";
  ctx.lineWidth = Math.max(5, Math.round(Math.min(canvasWidth, canvasHeight) * 0.014));
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  if (panelPattern === "vertical") {
    ctx.moveTo(canvasWidth * 0.33, 0); ctx.lineTo(canvasWidth * 0.35, canvasHeight);
    ctx.moveTo(canvasWidth * 0.68, 0); ctx.lineTo(canvasWidth * 0.66, canvasHeight);
  } else if (panelPattern === "horizontal") {
    ctx.moveTo(0, canvasHeight * 0.33); ctx.lineTo(canvasWidth, canvasHeight * 0.35);
    ctx.moveTo(0, canvasHeight * 0.68); ctx.lineTo(canvasWidth, canvasHeight * 0.66);
  } else if (panelPattern === "diagonal") {
    ctx.moveTo(0, canvasHeight * 0.2); ctx.lineTo(canvasWidth, canvasHeight * 0.8);
    ctx.moveTo(canvasWidth * 0.15, 0); ctx.lineTo(canvasWidth * 0.9, canvasHeight);
  } else if (panelPattern === "action") {
    ctx.moveTo(0, canvasHeight * 0.1); ctx.lineTo(canvasWidth, canvasHeight * 0.35);
    ctx.moveTo(0, canvasHeight * 0.55); ctx.lineTo(canvasWidth, canvasHeight * 0.8);
    ctx.moveTo(canvasWidth * 0.2, 0); ctx.lineTo(canvasWidth * 0.1, canvasHeight);
  } else {
    ctx.moveTo(canvasWidth * 0.34, 0); ctx.lineTo(canvasWidth * 0.36, canvasHeight);
    ctx.moveTo(0, canvasHeight * 0.5); ctx.lineTo(canvasWidth, canvasHeight * 0.47);
  }
  ctx.stroke();
};

export const drawFlash = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, active: boolean): void => {
  if (!active) return;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

export const getAudioStreamFromElement = (
  audioElement?: HTMLAudioElement | null
): MediaStream | null => {
  if (!audioElement) return null;

  const capture = (audioElement as HTMLAudioElement & {
    mozCaptureStream?: () => MediaStream;
    captureStream?: () => MediaStream;
  }).captureStream
    ?? (audioElement as HTMLAudioElement & {
      mozCaptureStream?: () => MediaStream;
      captureStream?: () => MediaStream;
    }).mozCaptureStream;

  if (!capture) return null;

  try {
    return capture.call(audioElement);
  } catch {
    return null;
  }
};

export const combineCanvasAndAudioStreams = (
  canvasStream: MediaStream,
  audioStream?: MediaStream | null
): { stream: MediaStream; hasAudio: boolean } => {
  const composedStream = new MediaStream(canvasStream.getVideoTracks());

  if (!audioStream) {
    return { stream: composedStream, hasAudio: false };
  }

  const audioTracks = audioStream.getAudioTracks();
  audioTracks.forEach((track) => composedStream.addTrack(track));

  return { stream: composedStream, hasAudio: audioTracks.length > 0 };
};

export const startCanvasRecording = (
  canvas: HTMLCanvasElement,
  fps: number,
  audioElement?: HTMLAudioElement | null
): { recorder: MediaRecorder; hasAudio: boolean } => {
  const canvasStream = canvas.captureStream(fps);
  const audioStream = getAudioStreamFromElement(audioElement);
  const { stream, hasAudio } = combineCanvasAndAudioStreams(canvasStream, audioStream);

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  return { recorder: new MediaRecorder(stream, { mimeType }), hasAudio };
};

export const stopCanvasRecording = async (
  mediaRecorder: MediaRecorder
): Promise<Blob> => {
  const chunks: BlobPart[] = [];

  return new Promise<Blob>((resolve, reject) => {
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onerror = () => {
      reject(new Error("録画の停止に失敗しました"));
    };

    mediaRecorder.onstop = () => {
      resolve(new Blob(chunks, { type: mediaRecorder.mimeType || "video/webm" }));
    };

    mediaRecorder.stop();
  });
};
