import type { SwitchMode, TimelineMarker } from "../types/mv";

type TimelineProps = {
  audioUrl: string | null;
  currentTime: number;
  audioDuration: number;
  onSeek: (value: number) => void;
  markers: TimelineMarker[];
  currentImageIndex: number;
  imagesLength: number;
  switchMode: SwitchMode;
  formatTime: (time: number) => string;
};

export default function Timeline({
  audioUrl,
  currentTime,
  audioDuration,
  onSeek,
  markers,
  currentImageIndex,
  imagesLength,
  switchMode,
  formatTime,
}: TimelineProps) {
  if (!audioUrl) return null;

  return (
    <div className="w-full rounded-xl border border-cyan-500/30 bg-zinc-950/90 p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-300">
        <span className="text-cyan-300">{formatTime(currentTime)}</span>
        <span>{formatTime(audioDuration)}</span>
      </div>

      <input
        type="range"
        min="0"
        max={audioDuration || 0}
        step="0.01"
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-pink-500"
      />

      <div className="relative mt-3 h-4 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-300" style={{ width: audioDuration > 0 ? `${(currentTime / audioDuration) * 100}%` : "0%" }} />
        {markers.map((marker) => (
          <div
            key={marker.index}
            className={`absolute top-0 h-full w-[3px] ${marker.index === currentImageIndex ? "bg-yellow-200" : "bg-white/70"}`}
            style={{ left: `${marker.percent}%` }}
            title={`画像 ${marker.index + 1}`}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-xs text-zinc-400">
        <span>画像 {imagesLength > 0 ? currentImageIndex + 1 : 0} / {imagesLength}</span>
        <span>{switchMode === "equal" ? "均等タイムライン" : switchMode === "peak" ? "音量ピーク＋補助" : "低音キック＋補助"}</span>
      </div>
    </div>
  );
}
