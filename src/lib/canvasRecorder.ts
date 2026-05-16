export const createExportCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  return canvas;
};

export const drawImageToCanvas = async (
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  width: number,
  height: number
): Promise<void> => {
  const image = new Image();
  image.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
  });

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

export const startCanvasRecording = (
  canvas: HTMLCanvasElement,
  fps: number
): MediaRecorder => {
  const stream = canvas.captureStream(fps);

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  return new MediaRecorder(stream, { mimeType });
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
