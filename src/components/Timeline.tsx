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
    <div className="w-full max-w-[720px] bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <div className="flex justify-between text-xs text-zinc-400 mb-2">
        <span>{formatTime(currentTime)}</span>
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

      <div className="mt-3 h-4 bg-zinc-800 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
          style={{ width: audioDuration > 0 ? `${(currentTime / audioDuration) * 100}%` : "0%" }}
        />

        {markers.map((marker) => (
          <div
            key={marker.index}
            className={`absolute top-0 h-full w-[3px] ${
              marker.index === currentImageIndex ? "bg-yellow-300" : "bg-white/70"
            }`}
            style={{ left: `${marker.percent}%` }}
            title={`画像 ${marker.index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-between text-xs text-zinc-500 mt-2">
        <span>画像 {imagesLength > 0 ? currentImageIndex + 1 : 0}</span>

        <span>
          {switchMode === "equal"
            ? "均等タイムライン"
            : switchMode === "peak"
            ? "音量ピーク＋補助"
            : "低音キック＋補助"}
        </span>
      </div>
    </div>
  );
}
