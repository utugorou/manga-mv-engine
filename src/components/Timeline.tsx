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
    <div className="w-full rounded-2xl border border-cyan-500/40 bg-zinc-950/90 p-4">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-300">
        <span className="text-cyan-300">{formatTime(currentTime)}</span>
        <span>{formatTime(audioDuration)}</span>
      </div>
      <input type="range" min="0" max={audioDuration || 0} step="0.01" value={currentTime} onChange={(e) => onSeek(Number(e.target.value))} className="w-full accent-fuchsia-500" />

      <div className="relative mt-3 h-6 overflow-hidden rounded-full bg-zinc-800/80 border border-zinc-700">
        <div className="h-full bg-[linear-gradient(90deg,#ec4899_0%,#22d3ee_55%,#f0abfc_100%)] opacity-90" style={{ width: audioDuration > 0 ? `${(currentTime / audioDuration) * 100}%` : "0%" }} />
        {markers.map((marker) => (
          <div key={marker.index} className={`absolute top-0 h-full w-[3px] ${marker.index === currentImageIndex ? "bg-yellow-200 shadow-[0_0_10px_#fde047]" : "bg-white/70"}`} style={{ left: `${marker.percent}%` }} title={`画像 ${marker.index + 1}`} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-cyan-200">🎵 音楽トラック</div>
        <div className="rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-2 text-fuchsia-200">🎬 映像トラック：画像 {imagesLength > 0 ? currentImageIndex + 1 : 0} / {imagesLength}</div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-yellow-100">✨ エフェクトトラック：{switchMode === "equal" ? "均等タイムライン" : switchMode === "peak" ? "音量ピーク＋補助" : "低音キック＋補助"}</div>
      </div>
    </div>
  );
}
