type Props = { isPlaying: boolean; isRecording: boolean; onPlay: () => void; onPause: () => void; onReset: () => void };

export default function ControlButtons({ isPlaying, isRecording, onPlay, onPause, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-fuchsia-500/30 bg-zinc-950/70 p-2.5 sm:gap-3 sm:p-3">
      <button
        onClick={onPlay}
        className={`h-8 w-8 rounded-full border text-xs font-black transition-all sm:h-14 sm:w-14 sm:text-lg ${
          isPlaying
            ? "bg-gradient-to-br from-fuchsia-500 to-pink-500 border-fuchsia-200 shadow-[0_0_24px_#d946ef] text-white"
            : "bg-zinc-900 border-fuchsia-500/70 hover:bg-fuchsia-500/20 text-fuchsia-200"
        }`}
      >
        ▶
      </button>
      <button
        onClick={onPause}
        className="rounded-lg border border-cyan-400/70 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/20 sm:rounded-xl sm:px-6 sm:py-2 sm:text-base"
      >
        一時停止
      </button>
      <button
        onClick={onReset}
        className="rounded-lg border border-yellow-300/70 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-yellow-100 hover:bg-yellow-400/20 sm:rounded-xl sm:px-6 sm:py-2 sm:text-base"
      >
        最初から
      </button>
      <div className="ml-auto flex items-center gap-1.5 text-[10px] sm:text-xs">
        <span className={`rounded-full border px-2 py-1 ${isPlaying ? "border-fuchsia-300 bg-fuchsia-500/20 text-fuchsia-100" : "border-zinc-700 bg-zinc-900 text-zinc-400"}`}>
          {isPlaying ? "再生中" : "停止中"}
        </span>
        <span className={`rounded-full border px-2 py-1 ${isRecording ? "border-rose-300 bg-rose-500/20 text-rose-100" : "border-zinc-700 bg-zinc-900 text-zinc-500"}`}>
          {isRecording ? "録画中" : "録画待機"}
        </span>
      </div>
    </div>
  );
}
