type Props = { isPlaying: boolean; onPlay: () => void; onPause: () => void; onReset: () => void };

export default function ControlButtons({ isPlaying, onPlay, onPause, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-fuchsia-500/30 bg-zinc-950/70 p-3">
      <button
        onClick={onPlay}
        className={`h-14 w-14 rounded-full font-black border transition-all text-lg ${
          isPlaying
            ? "bg-gradient-to-br from-fuchsia-500 to-pink-500 border-fuchsia-200 shadow-[0_0_24px_#d946ef] text-white"
            : "bg-zinc-900 border-fuchsia-500/70 hover:bg-fuchsia-500/20 text-fuchsia-200"
        }`}
      >
        ▶
      </button>
      <button
        onClick={onPause}
        className="px-6 py-2 rounded-xl font-bold border border-cyan-400/70 bg-zinc-900 hover:bg-cyan-500/20 text-cyan-200"
      >
        一時停止
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-xl font-bold border border-yellow-300/70 bg-zinc-900 hover:bg-yellow-400/20 text-yellow-100"
      >
        最初から
      </button>
      <span className={`ml-auto rounded-full px-3 py-1 text-xs border ${isPlaying ? "border-fuchsia-300 bg-fuchsia-500/20 text-fuchsia-100" : "border-zinc-700 bg-zinc-900 text-zinc-400"}`}>{isPlaying ? "再生中" : "停止中"}</span>
    </div>
  );
}
