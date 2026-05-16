export const formatTime = (time: number) => {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const createEqBars = (freqData: Uint8Array, barCount = 12) => {
  const chunkSize = Math.floor(freqData.length / barCount);
  return Array.from({ length: barCount }, (_, index) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    let sum = 0;
    for (let i = start; i < end; i++) sum += freqData[i];
    const avg = sum / chunkSize;
    return Math.max(8, Math.round((avg / 255) * 100));
  });
};
