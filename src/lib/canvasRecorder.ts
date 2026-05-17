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

export type CanvasImageMotionDrawOptions = {
  motionType?: "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "shake" | "comic" | "panUp" | "panDown" | "diagonalPan" | "slowZoomIn" | "breathZoom" | "impactZoom" | "glitchJump" | "grooveBounce" | "sideGroove" | "handheld";
  chorusBoost?: boolean;
  recordingElapsedMs?: number;
  motionAmplitudeMultiplier?: number;
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

type SizedCanvasSource = CanvasImageSource & { width: number; height: number };

export const drawCoverImage = (ctx: CanvasRenderingContext2D, image: SizedCanvasSource, canvasWidth: number, canvasHeight: number): void => {
  const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
};

export const drawCoverImageWithMotion = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  options: CanvasImageMotionDrawOptions = {}
): void => {
  const elapsedMs = options.recordingElapsedMs ?? 0;
  const motionType = options.motionType ?? "zoomIn";
  const chorusBoost = options.chorusBoost ?? false;
  const motionAmp = options.motionAmplitudeMultiplier ?? 1;

  const slowCycle = elapsedMs / 7000;
  const fastCycle = elapsedMs / 600;
  const chorusCycle = elapsedMs / 700;
  const slowSin = Math.sin(slowCycle * Math.PI * 2);
  const fastSin = Math.sin(fastCycle * Math.PI * 2);
  const chorusSin = Math.sin(chorusCycle * Math.PI * 2);
  const chorusCos = Math.cos(chorusCycle * Math.PI * 2);

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let rotation = 0;

  if (chorusBoost) {
    scale = 1.08 + ((chorusSin + 1) / 2) * 0.12; // 1.08 - 1.2
    rotation = chorusCos * 0.016; // around +/- 0.9deg
    translateX = chorusSin * canvasWidth * 0.004;
    translateY = Math.sin((elapsedMs / 800) * Math.PI * 2) * canvasHeight * 0.003;
  } else {
    switch (motionType) {
      case "zoomIn":
        scale = 1 + ((slowSin + 1) / 2) * 0.12;
        break;
      case "zoomOut":
        scale = 1.12 - ((slowSin + 1) / 2) * 0.12;
        break;
      case "panLeft":
        scale = 1.1;
        translateX = -((slowSin + 1) / 2) * canvasWidth * 0.06 * motionAmp;
        break;
      case "panRight":
        scale = 1.1;
        translateX = ((slowSin + 1) / 2) * canvasWidth * 0.06 * motionAmp;
        break;
      case "shake":
        translateX = fastSin * canvasWidth * 0.006;
        translateY = Math.cos((elapsedMs / 500) * Math.PI * 2) * canvasHeight * 0.004;
        break;
      case "comic":
        scale = 1.03 + ((fastSin + 1) / 2) * 0.03;
        rotation = Math.sin((elapsedMs / 800) * Math.PI * 2) * 0.018;
        translateX = Math.cos((elapsedMs / 700) * Math.PI * 2) * canvasWidth * 0.003;
        break;
      case "panUp":
        scale = 1.08;
        translateY = -((slowSin + 1) / 2) * canvasHeight * 0.05 * motionAmp;
        break;
      case "panDown":
        scale = 1.08;
        translateY = ((slowSin + 1) / 2) * canvasHeight * 0.05 * motionAmp;
        break;
      case "diagonalPan":
        scale = 1.1;
        translateX = slowSin * canvasWidth * 0.04 * motionAmp;
        translateY = -slowSin * canvasHeight * 0.035 * motionAmp;
        break;
      case "slowZoomIn":
        scale = 1 + ((Math.sin((elapsedMs / 10000) * Math.PI * 2) + 1) / 2) * 0.08;
        break;
      case "breathZoom":
        scale = 1.02 + Math.sin((elapsedMs / 6000) * Math.PI * 2) * 0.02;
        break;
      case "impactZoom":
        scale = 1 + Math.max(0, Math.sin((elapsedMs / 900) * Math.PI * 2)) * 0.12;
        break;
      case "glitchJump":
        translateX = ((Math.floor(elapsedMs / 110) % 3) - 1) * canvasWidth * 0.006;
        translateY = ((Math.floor(elapsedMs / 140) % 3) - 1) * canvasHeight * 0.004;
        break;
      case "grooveBounce":
        scale = 1.04;
        translateY = Math.sin((elapsedMs / 1100) * Math.PI * 2) * canvasHeight * 0.02;
        break;
      case "sideGroove":
        scale = 1.04;
        translateX = Math.sin((elapsedMs / 1000) * Math.PI * 2) * canvasWidth * 0.018 * motionAmp;
        break;
      case "handheld":
        scale = 1.05;
        translateX = Math.sin((elapsedMs / 900) * Math.PI * 2) * canvasWidth * 0.008;
        translateY = Math.cos((elapsedMs / 780) * Math.PI * 2) * canvasHeight * 0.007;
        rotation = Math.sin((elapsedMs / 1200) * Math.PI * 2) * 0.012;
        break;
      default:
        break;
    }
  }

  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.translate(translateX, translateY);
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
  drawCoverImage(ctx, image, canvasWidth, canvasHeight);
  ctx.restore();
};

export const drawImageToCanvas = async (
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  width: number,
  height: number,
  motionOptions?: CanvasImageMotionDrawOptions
): Promise<void> => {
  const image = await loadImage(imageUrl);
  if (motionOptions) {
    drawCoverImageWithMotion(ctx, image, width, height, motionOptions);
    return;
  }
  drawCoverImage(ctx, image, width, height);
};

export const drawSpeechBubble = (
  ctx: CanvasRenderingContext2D,
  text: string,
  position: CanvasOverlayPosition,
  canvasWidth: number,
  canvasHeight: number,
  options: { variant?: "normal" | "spiky" | "thought"; scale?: 1 | 2 } = {}
): void => {
  if (!text) return;
  const p = getAnchor(position, canvasWidth, canvasHeight);
  const bubbleScale = options.scale ?? 1;
  const variant = options.variant ?? "normal";
  const fontSize = Math.max(20, Math.round(Math.min(canvasWidth, canvasHeight) * 0.05 * bubbleScale));
  ctx.font = `800 ${fontSize}px sans-serif`;
  const w = Math.min(canvasWidth * 0.56, ctx.measureText(text).width + fontSize * 1.7);
  const h = fontSize * 2.15;
  const x = Math.max(24, Math.min(canvasWidth - w - 24, p.x - w / 2));
  const y = Math.max(24, Math.min(canvasHeight - h - 24, p.y - h / 2));

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(3, Math.round(fontSize * 0.1));
  if (variant === "spiky") {
    const spikes = 22;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const outer = Math.max(w, h) * 0.55;
    const inner = Math.max(w, h) * 0.42;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outer : inner;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, variant === "thought" ? h * 0.42 : h / 2);
    ctx.fill();
    ctx.stroke();
  }

  const tailSize = Math.max(12, fontSize * 0.33);
  if (variant === "thought") {
    ctx.beginPath();
    ctx.arc(x + w * 0.72, y + h + tailSize * 0.5, tailSize * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + w * 0.8, y + h + tailSize * 1.1, tailSize * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.75, y + h);
    ctx.lineTo(x + w * 0.75 + tailSize, y + h + tailSize);
    ctx.lineTo(x + w * 0.6, y + h - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.textAlign = "start";
};

export type CanvasSfxDrawOptions = {
  chorusBoost?: boolean;
  sfxScale?: number;
  viewportScale?: number;
  sfxItems?: Array<{ text: string; position: "topLeft" | "top" | "topRight" | "left" | "center" | "right" | "bottomLeft" | "bottom" | "bottomRight" | "random"; scale: number; rotation: number }>;
};

export const drawSfxText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  position: CanvasOverlayPosition,
  canvasWidth: number,
  canvasHeight: number,
  options: CanvasSfxDrawOptions = {}
): void => {
  if (!text) return;
  const baseSize = options.chorusBoost ? 64 : 48;
  const scale = options.sfxScale ?? 1;
  const viewportScale = options.viewportScale ?? 1;
  const shortSide = Math.min(canvasWidth, canvasHeight);
  const maxFontSize = shortSide * 0.42;
  const fontSize = Math.max(20, Math.min(baseSize * scale * viewportScale, maxFontSize));
  ctx.font = `900 italic ${fontSize}px sans-serif`;
  ctx.textAlign = position.includes("Right") ? "right" : position === "center" ? "center" : "left";
  ctx.textBaseline = "middle";
  ctx.lineWidth = Math.max(5, Math.round(fontSize * 0.11));
  ctx.strokeStyle = "rgba(0,0,0,0.95)";
  ctx.fillStyle = "#ffffff";
  const drawOne = (label: string, pos: CanvasOverlayPosition, scaleOverride: number, rotateDeg: number) => {
    const anchor = getAnchor(pos, canvasWidth, canvasHeight);
    const localSize = Math.max(20, Math.min(baseSize * scaleOverride * viewportScale, maxFontSize));
    ctx.font = `900 italic ${localSize}px sans-serif`;
    ctx.textAlign = pos.includes("Right") ? "right" : pos === "center" ? "center" : "left";
    const textWidth = ctx.measureText(label).width;
    const halfW = textWidth / 2;
    const clampedX = Math.max(halfW + 20, Math.min(canvasWidth - halfW - 20, anchor.x));
    const clampedY = Math.max(localSize * 0.7, Math.min(canvasHeight - localSize * 0.7, anchor.y));
    ctx.save();
    ctx.translate(clampedX, clampedY);
    ctx.rotate((rotateDeg * Math.PI) / 180);
    ctx.strokeText(label, 0, 0);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  };
  if (options.sfxItems && options.sfxItems.length > 0) {
    const normalizedItems = options.sfxItems.slice(0, 4);
    const unifiedText = normalizedItems[0]?.text ?? text;
    const unifiedScale = normalizedItems[0]?.scale ?? scale;
    normalizedItems.forEach((item) => drawOne(unifiedText, (item.position === "top" ? "topLeft" : item.position === "right" ? "bottomRight" : item.position === "left" ? "bottomLeft" : item.position === "bottom" ? "bottomRight" : item.position === "random" ? "center" : item.position) as CanvasOverlayPosition, unifiedScale, item.rotation));
  } else {
    drawOne(text, position, scale, -4.5);
  }
  ctx.textAlign = "start";
};

export const drawGlitchLines = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, frame: number): void => {
  for (let i = 0; i < 6; i++) {
    const y = (frame * (6 + i) + i * canvasHeight * 0.18) % canvasHeight;
    const h = 1 + (i % 3);
    const xOffset = ((frame * (i + 3)) % 24) - 12;
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.2)" : "rgba(34,211,238,0.16)";
    ctx.fillRect(xOffset, y, canvasWidth - xOffset, h);
  }
};

export const drawEqualizerBars = (ctx: CanvasRenderingContext2D, eqBars: number[], canvasWidth: number, canvasHeight: number, eqType: "bars" | "wideBars" | "mirror" | "wave" | "glitchEq" | "pulse" | "circle" = "bars"): void => {
  const barCount = Math.max(12, eqBars.length);
  const eqAreaHeight = canvasHeight * 0.2;
  const eqAreaTop = canvasHeight - eqAreaHeight;
  const eqAreaMid = eqAreaTop + eqAreaHeight / 2;
  if (eqType === "wave") {
    ctx.strokeStyle = "rgba(34,211,238,0.95)";
    ctx.lineWidth = Math.max(2, canvasHeight * 0.006);
    ctx.beginPath();
    for (let i = 0; i < canvasWidth; i++) {
      const idx = Math.floor((i / canvasWidth) * eqBars.length) % eqBars.length;
      const amp = (eqBars[idx] ?? 15) / 100;
      const y = eqAreaMid + Math.sin((i / canvasWidth) * Math.PI * 8) * amp * eqAreaHeight * 0.42;
      if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
    }
    ctx.stroke();
    return;
  }
  const barWidth = Math.max(5, canvasWidth * 0.008);
  const gap = eqType === "wideBars" ? Math.max(2, barWidth * 0.2) : Math.max(3, barWidth * 0.5);
  const fullWidth = barCount * barWidth + (barCount - 1) * gap;
  const baseX = canvasWidth * 0.5 - fullWidth / 2;
  const baseY = canvasHeight - canvasHeight * 0.02;

  for (let idx = 0; idx < barCount; idx++) {
    const bar = eqBars[idx % eqBars.length] ?? 15;
    const h = Math.max(8, (bar / 100) * eqAreaHeight * (eqType === "pulse" ? 0.95 : 0.8));
    const x = baseX + idx * (barWidth + gap);
    if (eqType === "mirror") {
      ctx.fillStyle = idx % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(34,211,238,0.95)";
      ctx.fillRect(x, eqAreaMid - h, barWidth, h);
      ctx.fillRect(x, eqAreaMid, barWidth, h);
    } else if (eqType === "circle") {
      ctx.fillStyle = idx % 2 === 0 ? "rgba(255,255,255,0.78)" : "rgba(34,211,238,0.9)";
      const radius = Math.max(2, h * 0.16);
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, baseY - h, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = eqType === "glitchEq" && idx % 3 === 0 ? "rgba(244,114,182,0.95)" : idx % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(34,211,238,0.9)";
      ctx.fillRect(x, baseY - h, barWidth, h);
    }
  }
};

export const drawComicPanels = (ctx: CanvasRenderingContext2D, panelPattern: CanvasOverlayDrawOptions["panelPattern"], canvasWidth: number, canvasHeight: number): void => {
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth = Math.max(4, Math.round(Math.min(canvasWidth, canvasHeight) * 0.012));
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
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

export const getAudioStreamFromElement = (
  mediaElement?: HTMLMediaElement | null
): MediaStream | null => {
  if (!mediaElement) return null;

  const capture = (mediaElement as HTMLMediaElement & {
    mozCaptureStream?: () => MediaStream;
    captureStream?: () => MediaStream;
  }).captureStream
    ?? (mediaElement as HTMLMediaElement & {
      mozCaptureStream?: () => MediaStream;
      captureStream?: () => MediaStream;
    }).mozCaptureStream;

  if (!capture) return null;

  try {
    return capture.call(mediaElement);
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
  mediaElement?: HTMLMediaElement | null,
  includeAudio = true,
  mimeType?: string
): { recorder: MediaRecorder; hasAudio: boolean } => {
  const canvasStream = canvas.captureStream(fps);
  const audioStream = includeAudio ? getAudioStreamFromElement(mediaElement) : null;
  const { stream, hasAudio } = combineCanvasAndAudioStreams(canvasStream, audioStream);

  const recorderMimeType = mimeType
    ?? (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm");

  return { recorder: new MediaRecorder(stream, { mimeType: recorderMimeType }), hasAudio };
};

export const stopCanvasRecording = async (
  mediaRecorder: MediaRecorder,
  blobMimeType = "video/webm"
): Promise<Blob> => {
  const chunks: BlobPart[] = [];

  return new Promise<Blob>((resolve, reject) => {
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onerror = () => {
      reject(new Error("録画に失敗しました"));
    };

    mediaRecorder.onstop = () => {
      resolve(new Blob(chunks, { type: blobMimeType }));
    };

    mediaRecorder.stop();
  });
};
